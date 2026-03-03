import { render, screen, fireEvent} from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SearchBar } from "./SearchBar";

describe("SearchBar Component", () => {
  const mockOnSearchChange = vi.fn();
  const mockOnSpecialtyChange = vi.fn();
  const specialties = ["All", "Cardiology", "Dentist"];

  it("should update search term when user types in the input field", () => {
    render(
      <SearchBar 
        searchTerm="" 
        onSearchChange={mockOnSearchChange} 
      />
    );

    
    const input = screen.getByPlaceholderText(/Search by name/i);
    fireEvent.change(input, { target: { value: "Ahmed" } });
    expect(mockOnSearchChange).toHaveBeenCalledWith("Ahmed");
  });

  it("should not render the specialty filter when showSpecialtyFilter is false", () => {
    render(
      <SearchBar 
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        specialties={specialties}
        onSpecialtyChange={mockOnSpecialtyChange} 
        showSpecialtyFilter={true}
      />
    );

    
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "Dentist" } });
    expect(mockOnSpecialtyChange).toHaveBeenCalledWith("Dentist");
  });
  it("should be specialty hidden", () => {
    render(
      <SearchBar 
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        specialties={specialties}
        onSpecialtyChange={mockOnSpecialtyChange} 
        showSpecialtyFilter={false}
      />
    );
    // expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
    // أدق في حالة وجود أكتر من Select
    expect(screen.queryByText(/All Specialties/i)).not.toBeInTheDocument();
  });

 it("should render appointment filters only when showAppointmentFilters is true", () => {
    render(
      <SearchBar 
        searchTerm=""
        onSearchChange={mockOnSearchChange}
        showAppointmentFilters={true}
      />
    );

    // نتحقق من وجود فلاتر المواعيد 
    expect(screen.getByText(/Any Time/i)).toBeInTheDocument();
    expect(screen.getByText(/All Status/i)).toBeInTheDocument();
  });
});