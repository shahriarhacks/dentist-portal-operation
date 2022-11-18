import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthProvider";
import BookingModal from "../BookingModal/BookingModal";
import AppointmentOption from "./AppointmentOption";

const AvailableAppointments = ({ selectedDate }) => {
  const [treatment, setTreatment] = useState(null);
  const { user } = useContext(AuthContext);

  const { data: appointmentOptions = [] } = useQuery({
    queryKey: ["appointment-options"],
    queryFn: () =>
      fetch("http://localhost:5000/appointment-options").then((res) =>
        res.json()
      ),
  });

  return (
    <section className="my-16">
      <p className="text-center text-secondary font-bold">
        Available Appointments on {format(selectedDate, "PP")}
      </p>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {appointmentOptions.map((option) => (
          <AppointmentOption
            key={option._id}
            appointmentOption={option}
            setTreatment={setTreatment}
          ></AppointmentOption>
        ))}
      </div>
      {treatment && user?.uid && (
        <BookingModal
          selectedDate={selectedDate}
          treatment={treatment}
          setTreatment={setTreatment}
        ></BookingModal>
      )}
    </section>
  );
};

export default AvailableAppointments;