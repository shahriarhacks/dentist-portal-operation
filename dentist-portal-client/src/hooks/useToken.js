import { useEffect, useState } from "react";

const useToken = (email) => {
  const [token, setToken] = useState("");
  useEffect(() => {
    if (email) {
      fetch(`${process.env.REACT_APP_SERVER_URL}/jwt?email=${email}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.accessToken) {
            localStorage.setItem("access-token", data.accessToken);
            setToken(data.accessToken);
          }
        });
    }
  }, [email]);
  return { token };
};

export default useToken;
