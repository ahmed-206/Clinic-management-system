import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { EditDoctorModal } from "./EditDoctorModal";
import type { UserProfile } from "../../types/types";

const mockDoctor : UserProfile = {
  id: "d1",
  name: "Dr. Ahmed",
  specialty: "Cardiology",
  price_per_session: 500,
  email: "ahmed@clinic.com",
  role: "doctor",
};

const mockOnSave = vi.fn();
const mockOnClose = vi.fn();

describe("EditDoctorModal", () => {
  it("modal should be hidden", () => {
    render(
      <BrowserRouter>
        <EditDoctorModal
          doctor={mockDoctor}
          isOpen={false}
          onClose={mockOnClose}
          onSave={mockOnSave}
          isUpdating={false}
        />
      </BrowserRouter>,
    );
    const modalTitle = screen.queryByText(/Edit Profile/i);

    expect(modalTitle).not.toBeInTheDocument()
  });
  it("modal should be visible", () => {
    render(
      <BrowserRouter>
        <EditDoctorModal
          doctor={mockDoctor}
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          isUpdating={false}
        />
      </BrowserRouter>,
    );
    const nameInput = screen.getByDisplayValue(/Dr. Ahmed/i);

    expect(nameInput).toBeInTheDocument()
  });
  it("should update inputes correctly", () => {
    render(
      <BrowserRouter>
        <EditDoctorModal
          doctor={mockDoctor}
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          isUpdating={false}
        />
      </BrowserRouter>,
    );
    const nameInput = screen.getByRole('textbox', {name : /specialty/i});
    fireEvent.change(nameInput, {target : {value: "Pediatrics"}});

    const saveButton = screen.getByRole('button', {name: /Save Changes/i});

    fireEvent.click(saveButton);


    expect(mockOnSave).toHaveBeenCalledWith(mockDoctor.id,
      expect.objectContaining({specialty: "Pediatrics"}));
  });

  it("modal should be closed", () => {
    render(
      <BrowserRouter>
        <EditDoctorModal
          doctor={mockDoctor}
          isOpen={true}
          onClose={mockOnClose}
          onSave={mockOnSave}
          isUpdating={false}
        />
      </BrowserRouter>,
    );
    const cancelButton = screen.getByRole('button', {name: /Cancel/i});

    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })
});
