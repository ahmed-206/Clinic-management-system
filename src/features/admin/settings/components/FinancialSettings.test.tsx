import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FinancialSettings } from "./FinancialSettings";
import { BrowserRouter} from "react-router-dom";

const mockUpdate = vi.fn();
vi.mock("../../../../hooks/admin/useSettings.ts", () => ({
    useSettings : () => ({
        isLoading: false,
        isUpdating: false,
        updateSettings : mockUpdate,
        settings: {
            id: 1,
            vat_percentage: 20,
            service_fee: 30,
            currency: "EGP"
        }
    })
}));

describe("Financial Settings", () => {
    it("should be change clinic fee when admin change it", () => {
        render(
            <BrowserRouter>
                <FinancialSettings />
            </BrowserRouter>
        );
        const nameInput = screen.getByRole('spinbutton', {name: /Service Fee /i});
        fireEvent.change(nameInput, {target : {value: 50}});
        const saveButton = screen.getByRole("button" ,{name :/Save Financial Rules/i});
        fireEvent.click(saveButton);
        expect(mockUpdate).toHaveBeenCalledWith(
            expect.objectContaining({service_fee: 50})
        )
    })
})