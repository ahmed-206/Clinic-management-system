import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BookAppointmentPage } from "./BookAppointmentPage";
import { useDoctors } from "../../hooks/useDoctors";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useNavigate: () => mockNavigate,
}));
vi.mock("../../hooks/useDoctors");
const mockedUseDoctors = vi.mocked(useDoctors);
const mockDoctors = [
  {
    id: "1",
    name: "Dr. Ahmed",
    specialty: "Cardiology",
    price_per_session: 500,
  },
  { id: "2", name: "Dr. Sara", specialty: "Dentist", price_per_session: 400 },
];

const setupDoctorsMock = (overrides = {}) => {
  mockedUseDoctors.mockReturnValue({
    data: mockDoctors,
    isLoading: false,
    isError: false,
    error: null,
    ...overrides, // هنا بنسمح بتغيير أي حالة (زي الـ loading)
  } as any);
};
describe("BookAppointmentPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading spinner when data is fetching", () => {
   setupDoctorsMock({data: undefined, isLoading: true})

    render(<BookAppointmentPage />);
    expect(screen.getByText(/Fetching our specialists/i)).toBeInTheDocument();
  });
  it("should show all doctors", () => {
    setupDoctorsMock()

    render(<BookAppointmentPage />);
    expect(screen.getByText(/Dr. Ahmed/i)).toBeInTheDocument();
    expect(screen.getByText(/Dr. Sara/i)).toBeInTheDocument();
  });
  it("should filter doctors by specialty when a tab is clicked", () => {
    setupDoctorsMock()

    render(<BookAppointmentPage />);
    const dentistTab = screen.getByRole("button", { name: /Dentist/i });
    fireEvent.click(dentistTab);
    expect(screen.queryByText(/Dr. Ahmed/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Dr. Sara/i)).toBeInTheDocument();
  });

  it("should filter doctors by name when typing in search input", () => {
   setupDoctorsMock()

    render(<BookAppointmentPage />);

    const searchInput = screen.getByPlaceholderText(/Search by name/i);
    fireEvent.change(searchInput, { target: { value: "Sara" } });

    expect(screen.getByText(/Dr. Sara/i)).toBeInTheDocument();
    expect(screen.queryByText(/Dr. Ahmed/i)).not.toBeInTheDocument();
  });
  it("should show No doctors found in this category when no found any doctor", () => {
   setupDoctorsMock()

    render(<BookAppointmentPage />);

    const searchInput = screen.getByPlaceholderText(/Search by name/i);
    fireEvent.change(searchInput, { target: { value: "ali" } });

    
    expect(screen.getByText(/No doctors found in this category/i)).toBeInTheDocument();
  });


});
