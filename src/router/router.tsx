import { createBrowserRouter, Navigate, Outlet, useParams } from "react-router-dom";
import SurveyIntroPage from "../views/SurveyIntroPage";
import NotPage from "../views/NotPage";
import SurveySelectionPage from "../views/SurveySelectionPage";
import SurveyQuestionPage_view from "../views/SurveyQuestionPage_view";
import SurveyPersonalInfoPage from "../views/SurveyPersonalInfoPage";
import SurveyQuestionPage from "../views/SurveyQuestionPage";
import SurveyEnd from "../views/SurveyEnd";
import AdminSettings from "../views/AdminSettings";
import AdminResults from "../views/AdminResults";
import AdminQuestionEditor from "../views/AdminQuestionEditor";
import AdminSujuResults from "../views/AdminSujuResults";
import { AxiosInterceptor } from "../api/axiosInterceptor";

// 리다이렉트 컴포넌트들
const Admin_go = () => {
	const now = new Date();
	return <Navigate to={`/admin/main/${now.getFullYear()}`} replace />;
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
	console.log("AdminLayout");
	return <AxiosInterceptor>{children}</AxiosInterceptor>;
};

const Survey_intro_go = () => {
	const now = new Date();
	return <Navigate to={`/survey/main/${now.getFullYear()}`} replace />;
};

const SurveyLayout = ({ children }: { children: React.ReactNode }) => {
	console.log("SurveyLayout");
	return <AxiosInterceptor>{children}</AxiosInterceptor>;
};

const AdminSurveyHome_go = () => {
	const { surveyType } = useParams<{ surveyType: string }>();
	return <Navigate to={`/admin/${surveyType}/1`} replace />;
};

const router = createBrowserRouter(
	[
		{
			path: "/",
			element: <Survey_intro_go />,
		},
		{
			path: "/survey",
			element: <Survey_intro_go />,
		},
		{
			path: "/survey",
			element: (
				<SurveyLayout>
					<Outlet />
				</SurveyLayout>
			),
			children: [
				{
					path: "main/:surveyYear",
					element: <SurveySelectionPage />,
				},
				{
					path: ":surveyType",
					element: <SurveyIntroPage />,
				},
				{
					path: ":surveyType/info",
					element: <SurveyPersonalInfoPage />,
				},
				{
					path: ":surveyType/:surveyPage",
					element: <SurveyQuestionPage />,
				},
				{
					path: "view/:surveyType/:surveyPage",
					element: <SurveyQuestionPage_view />,
				},
				{
					path: "end",
					element: <SurveyEnd />,
				},
			],
		},
		/* ------------------ 관리자 ------------------ */
		{
			path: "/admin",
			element: <Admin_go />,
		},
		{
			path: "/admin",
			element: (
				<AdminLayout>
					<Outlet />
				</AdminLayout>
			),
			children: [
				{
					path: "main",
					element: <Admin_go />,
				},
				{
					path: "main/:surveyYear",
					element: <AdminSettings />,
				},
				{
					path: ":surveyType",
					element: <AdminSurveyHome_go />,
				},
				{
					path: ":surveyType/:surveyPage",
					element: <AdminQuestionEditor />,
				},
				{
					path: ":surveyType/result/:surveyPage",
					element: <AdminResults />,
				},
			],
		},
		{
			path: "/service/:surveyType",
			element: <AdminSujuResults />,
		},
		{
			path: "/*",
			element: <NotPage />,
		},
	],
	{
		basename: "/RAC",
	}
);

export default router;
