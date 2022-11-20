const useHeaderJWT = () => {
  return {
    authorization: `SAST+SYJT ${localStorage.getItem("access-token")}`,
  };
};

export default useHeaderJWT;
