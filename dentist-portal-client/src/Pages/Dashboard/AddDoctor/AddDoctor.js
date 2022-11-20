import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loading from "../../Shared/Loading/Loading";

const AddDoctor = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const imageHostKey = process.env.REACT_APP_apiKeyImageHost;
  const { data: options, isLoading } = useQuery({
    queryKey: ["appointment-specialty"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/appointment-specialty`
      );
      const data = await res.json();
      return data;
    },
  });

  const handleAddDoctor = (data) => {
    const image = data.image[0];
    const formData = new FormData();
    formData.append("image", image);
    const url = `https://api.imgbb.com/1/upload?key=${imageHostKey}`;

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((imageData) => {
        if (imageData.success) {
          const doctor = {
            name: data?.name,
            email: data?.email,
            specialty: data?.specialty,
            image: imageData?.data?.url,
          };

          fetch(`${process.env.REACT_APP_SERVER_URL}/doctors`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: `SAST+SYJT ${localStorage.getItem(
                "access-token"
              )}`,
            },
            body: JSON.stringify(doctor),
          })
            .then((res) => res.json())
            .then((result) => {
              if (result.acknowledged) {
                toast.success(`${data.name} is added successfully`);
                navigate("/dashboard/manage-doctor");
              }
            });
        }
      });

    reset();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="h-[550px] flex justify-center items-center">
      <div className="w-96 p-7">
        <h2 className="text-xl text-center">Add Doctor</h2>
        <form onSubmit={handleSubmit(handleAddDoctor)}>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Name</span>
            </label>
            <input
              type="text"
              {...register("name", {
                required: "Name is Required",
              })}
              className="input input-secondary input-bordered w-full max-w-xs"
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is Required",
              })}
              className="input input-secondary input-bordered  w-full max-w-xs"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Specialty </span>
            </label>
            <select
              {...register("specialty", {
                required: "Specialty is Required",
              })}
              className="select select-info w-full max-w-xs"
            >
              {options.map((option) => (
                <option key={option?._id} value={option?.name}>
                  {option?.name}
                </option>
              ))}
            </select>
            {errors.specialty && (
              <p className="text-red-500">{errors.specialty.message}</p>
            )}
          </div>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Photo</span>
            </label>
            <input
              type="file"
              {...register("image", {
                required: "Photo is Required",
              })}
              className="file-input file-input-bordered file-input-secondary w-full max-w-xs"
            />
            {errors.image && (
              <p className="text-red-500">{errors.image.message}</p>
            )}
          </div>
          <input
            className="btn btn-primary w-full mt-4"
            value="Add Doctor"
            type="submit"
          />
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;
