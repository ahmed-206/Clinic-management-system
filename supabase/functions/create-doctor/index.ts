import { serve } from "https://deno.land/std@0.161.0/http/server.ts"
import { createClient} from "https://esm.sh/@supabase/supabase-js@2"

// إعداد الهيدرز الخاصة بـ CORS للسماح بالطلبات من المتصفح
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// تعريف شكل البيانات المتوقع استلامها
interface DoctorRequestBody {
  email: string;
  password?: string;
  name: string;
  specialty: string;
}

serve(async (req: Request): Promise<Response> => {
  // التعامل مع طلبات OPTIONS الخاصة بالمتصفح
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // جلب متغيرات البيئة
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

    // إنشاء عميل سوبابيس بصلاحيات الأدمن (تجاوز الـ RLS)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // 1. استخراج والتحقق من التوكن (JWT)
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('No authorization header provided')

    const token = authHeader.replace('Bearer ', '')
    const { data: { user: currentUser }, error: userError } = await supabaseAdmin.auth.getUser(token)

    if (userError || !currentUser) {
      throw new Error(`Authentication failed: ${userError?.message ?? 'Unknown error'}`)
    }

    // 2. التحقق من الصلاحيات (Admin Check) من قاعدة البيانات مباشرة
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', currentUser.id)
      .single()

    if (profileError || profile?.role !== 'admin') {
      console.error(`Access denied for: ${currentUser.email}`)
      throw new Error('Unauthorized: Only admins can perform this action')
    }

    // 3. معالجة بيانات الطبيب الجديد
    const body: DoctorRequestBody = await req.json()
    
    // 4. إنشاء المستخدم في نظام الهوية (Auth)
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: body.email,
      password: body.password || 'Default123456',
      email_confirm: true,
      user_metadata: { name: body.name, role: 'doctor' }
    })

    if (authError) throw authError

    // 5. تحديث بيانات البروفايل للطبيب الجديد
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        name: body.name, 
        specialty: body.specialty, 
        role: 'doctor' 
      })
      .eq('id', authUser.user.id)

    if (updateError) throw updateError

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Doctor account created successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: unknown) {
    // التعامل مع الأخطاء بشكل آمن واستخراج الرسالة
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
    console.error("Function Error:", errorMessage)

    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})