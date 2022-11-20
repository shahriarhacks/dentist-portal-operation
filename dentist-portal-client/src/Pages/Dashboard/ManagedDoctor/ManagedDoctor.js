import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import useHeader from "../../../hooks/useHeaderJWT";
import ConfirmationModal from "../../Shared/ConfirmationModal/ConfirmationModal";
import Loading from "../../Shared/Loading/Loading";

const ManagedDoctor = () => {
  const header = useHeader();
  const [deleteDoctor, setDeleteDoctor] = useState(null);

  const {
    data: doctors,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/doctors`, {
          headers: header,
        });
        const data = await res.json();
        return data;
      } catch (err) {}
    },
  });
  const closeModal = () => {
    setDeleteDoctor(null);
  };

  const handleDelete = (doctor) => {
    fetch(`${process.env.REACT_APP_SERVER_URL}/doctors/${doctor?._id}`, {
      method: "DELETE",
      headers: header,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.acknowledged) {
          refetch();
          toast.success(`Delete confirm Doctor ${deleteDoctor?.name}`);
        }
      });
  };

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div>
      <h3 className="text-3xl my-5">Manage Doctors</h3>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>SL</th>
              <th>Avatar</th>
              <th>Name</th>
              <th>Email</th>
              <th>Specialty</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, i) => (
              <tr key={doctor._id}>
                <th>{i + 1}</th>
                <td>
                  <div className="avatar">
                    <div className="w-24 rounded-full">
                      <img src={doctor.image} alt="" />
                    </div>
                  </div>
                </td>
                <td>{doctor.name}</td>
                <td>{doctor.email}</td>
                <td>{doctor.specialty}</td>
                <td>
                  <label
                    onClick={() => setDeleteDoctor(doctor)}
                    htmlFor="confirmation-modal"
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {deleteDoctor && (
        <ConfirmationModal
          deleteAction={handleDelete}
          closeModal={closeModal}
          modalData={deleteDoctor}
          title={`Are you sure you want to delete Doctor ${deleteDoctor?.name}`}
          message={`If you delete Doctor ${deleteDoctor?.name} it can't be undone previous position`}
        />
      )}
    </div>
  );
};

export default ManagedDoctor;
