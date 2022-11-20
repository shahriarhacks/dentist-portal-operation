const useHeader = () => {
  return {
    authorization: `SAST+SYJT ${localStorage.getItem("access-token")}`,
  };
};

export default useHeader;
