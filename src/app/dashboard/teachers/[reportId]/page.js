import Teacher from "@/models/Teacher";
import AddTeacherPage from "@/templates/AddTeacherPage";
import connectDB from "@/utils/connectDB";

async function Edit({ params }) {
  const { reportId } = await params;
  await connectDB();
  const teacher = await Teacher.findOne({ _id: reportId });

  if (!teacher) return <h3>مشکلی پیش آمده است. لطفا دوباره امتحان کنید ...</h3>;

  return <AddTeacherPage data={JSON.parse(JSON.stringify(teacher))} />;
}

export default Edit;
