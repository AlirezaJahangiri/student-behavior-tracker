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
      <SyncLoader
        visible={true}
        width="200"
        color="#229ED9"
        ariaLabel="infinity-spin-loading"
      />
    </div>
  );
}

export default Loader;
