import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LuCheck } from 'react-icons/lu';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    desc: 'Perfect for trying it out with a single doctor.',
    cta: 'Start Free',
    ctaLink: '/login',
    highlight: false,
    features: [
      '1 doctor',
      'Up to 30 appointments/month',
      'Online booking page',
      'Basic notifications',
      'Patient records',
    ],
  },
  {
    name: 'Clinic',
    price: '299',
    currency: 'EGP',
    period: 'per month',
    desc: 'For growing clinics that need more power.',
    cta: 'Start 14-day Trial',
    ctaLink: '/login',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Up to 5 doctors',
      'Unlimited appointments',
      'Email & WhatsApp notifications',
      'Digital prescriptions',
      'Full medical history',
      'Analytics dashboard',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'tailored to you',
    desc: 'For hospital groups and large multi-branch clinics.',
    cta: 'Contact Us',
    ctaLink: 'mailto:hello@clinic.com',
    highlight: false,
    features: [
      'Unlimited doctors',
      'Multi-branch support',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      'On-site training',
    ],
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">

      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="text-center space-y-3 mb-14">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs font-bold uppercase tracking-widest text-primary/60"
        >
          Transparent pricing
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-4xl font-bold text-primary"
        >
          Start free. Scale when ready.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-secondary/60 text-sm max-w-md mx-auto"
        >
          No setup fees. No hidden costs. Cancel anytime.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className={`relative rounded-2xl p-7 flex flex-col gap-5 ${
              plan.highlight
                ? 'bg-primary text-white shadow-2xl shadow-primary/30 border-2 border-primary scale-[1.03]'
                : 'bg-white border border-neutral-100 shadow-sm'
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-primary text-[10px] font-bold px-4 py-1 rounded-full shadow border border-primary/20">
                {plan.badge}
              </div>
            )}

            <div>
              <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${plan.highlight ? 'text-white/60' : 'text-primary/60'}`}>
                {plan.name}
              </p>
              <div className="flex items-baseline gap-1">
                {plan.currency && <span className={`text-sm font-semibold ${plan.highlight ? 'text-white/70' : 'text-secondary/60'}`}>{plan.currency}</span>}
                <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-primary'}`}>
                  {plan.price}
                </span>
              </div>
              <p className={`text-xs mt-1 ${plan.highlight ? 'text-white/60' : 'text-secondary/50'}`}>{plan.period}</p>
              <p className={`text-sm mt-3 leading-relaxed ${plan.highlight ? 'text-white/80' : 'text-secondary/70'}`}>{plan.desc}</p>
            </div>

            <ul className="flex flex-col gap-2.5">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2.5 text-sm">
                  <LuCheck
                    size={14}
                    className={`shrink-0 ${plan.highlight ? 'text-white' : 'text-primary'}`}
                  />
                  <span className={plan.highlight ? 'text-white/90' : 'text-secondary/70'}>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              to={plan.ctaLink}
              className={`mt-auto text-center text-sm font-bold px-6 py-3 rounded-xl transition-all duration-200 ${
                plan.highlight
                  ? 'bg-white text-primary hover:bg-white/90'
                  : 'bg-primary/5 text-primary border border-primary/20 hover:bg-primary hover:text-white'
              }`}
            >
              {plan.cta}
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
