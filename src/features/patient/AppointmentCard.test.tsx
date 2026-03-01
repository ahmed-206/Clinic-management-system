import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AppointmentCard } from "./AppointmentCard";
import { BrowserRouter} from "react-router-dom";
import {type AppointmentCardProps } from "../../types/types";

// 1. محاكاة الـ Hooks الخارجية (Mocking)
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () =>mockNavigate,
}));

// محاكاه للـهوك لان المكون يستخدم useCancelAppointment
const mockMutate = vi.fn();
vi.mock("../../hooks/useCancelAppointment.ts", () => ({
  useCancelAppointment: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

describe("AppointmentCard Component", () => {
const createMockAppointment = (overrides: Partial<AppointmentCardProps['appointment']>) => {
    const defaultAppointment: AppointmentCardProps['appointment'] = {
      id: "1",
      doctor_id: "doc-123",
      appointment_date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      status: "confirmed",
      doctor: { 
        name: "Ahmed",
        specialty: "General Medicine" 
      },
      ...overrides, // هنا الـ Overrides بتبدل أي قيمة فوق
    };
    return defaultAppointment;
};
it("should display doctor name correctly", () => {
  const appointment = createMockAppointment({ doctor: { name: "Ahmed", specialty: "General Medicine" } });
  render(
    <BrowserRouter>
      <AppointmentCard appointment={appointment} />
    </BrowserRouter>
  );
  expect(screen.getByText("Dr. Ahmed")).toBeInTheDocument();
  expect(screen.getByText("A")).toBeInTheDocument();
});
it("should show 'Changes locked' if appointment is within 24 hours", () => {
  const soonDate = new Date();
  soonDate.setHours(soonDate.getHours() + 2);

  const soonAppointment = createMockAppointment({
      appointment_date: soonDate.toISOString(),
    });

    render(
      <BrowserRouter>
        <AppointmentCard appointment={soonAppointment} />
      </BrowserRouter>
    );

    expect(screen.getByText(/Changes locked/i)).toBeInTheDocument();
    // التأكد أن أزرار الإلغاء والتعديل مخفية
    expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
});
it("should render 'Cancelled' status badge", () => {
    // Override للحالة فقط
    const cancelledApp = createMockAppointment({ status: "cancelled" });

    render(
      <BrowserRouter>
        <AppointmentCard appointment={cancelledApp} />
      </BrowserRouter>
    );

    expect(screen.getByText(/Cancelled/i)).toBeInTheDocument();
  });
  it("should show 'Reschedule Now' button when status is reschedule_needed", () => {
    const rescheduleApp = createMockAppointment({status : "reschedule_needed"});

    render (
      <BrowserRouter>
        <AppointmentCard appointment={rescheduleApp} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Reschedule Now/i)).toBeInTheDocument();
  });
  it("should render 'Expired' badge for expired appointments", () => {
    const expiredApp = createMockAppointment({status: "expired"});
    render (
      <BrowserRouter>
        <AppointmentCard appointment={expiredApp}/>
      </BrowserRouter>
    );
    expect(screen.getByText(/Expired/i)).toBeInTheDocument();
    
  });
  it("should call cancel function when Cancel button is clicked", () => {
    const appointment = createMockAppointment({ status: "confirmed" });

    render(
      <BrowserRouter>
        <AppointmentCard appointment={appointment} />
      </BrowserRouter>
    );
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);
    expect(mockMutate).toHaveBeenCalledWith(appointment.id);
  })
});
