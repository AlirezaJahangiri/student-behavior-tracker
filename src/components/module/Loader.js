import { SyncLoader } from "react-spinners";

function Loader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SyncLoader color="#229ED9" size={15} />
    </div>
  );
}

export default Loader;
