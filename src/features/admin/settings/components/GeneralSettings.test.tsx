import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GeneralSettings } from "./GeneralSettings";
import { BrowserRouter} from "react-router-dom";

const mockUpdate = vi.fn();
vi.mock("../../../../hooks/admin/useSettings", () => ({
    useSettings: () => ({
        isLoading: false,
        isUpdating: false,
        updateSettings : mockUpdate,
        settings: {
            id: 1,
            clinic_name: "Hope Clinic",
            clinic_email: "test@test.com",
            clinic_phone: "0123456789",
        }
    })
}));

describe("General Settings", () => {

    it("should update clinic name when admin types and clicks save", () => {
        render(
            <BrowserRouter>
                <GeneralSettings />
            </BrowserRouter>
        );
        const nameInput = screen.getByLabelText(/Clinic Name/i) as HTMLInputElement;
        
        fireEvent.change(nameInput, {target : {value : "A live Clinic"}});

        const saveButton = screen.getByRole("button" ,{name :/Save Changes/i});
        fireEvent.click(saveButton);

        expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ clinic_name: "A live Clinic" })
    );
    });
});