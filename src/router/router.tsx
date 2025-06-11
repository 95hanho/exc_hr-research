import { createBrowserRouter, Navigate, Outlet, useParams } from "react-router-dom";
import SurveyIntroPage from "../views/SurveyIntroPage";
import NotPage from "../views/NotPage";
import SurveySelectionPage from "../views/SurveySelectionPage";
import SurveyQuestionPage_view from "../views/SurveyQuestionPage_view";
import SurveyPersonalInfoPage from "../views/SurveyPersonalInfoPage";
import SurveyQuestionPage from "../views/SurveyQuestionPage";
import SurveyEnd from "../views/SurveyEnd";
import { AxiosInterceptor } from "../lib/axiosInterceptor";
import AdminSettings from "../views/AdminSettings";
import AdminResults from "../views/AdminResults";
import AdminQuestionEditor from "../views/AdminQuestionEditor";
import AdminSujuResults from "../views/AdminSujuResults";

// 리다이렉트 컴포넌트들
export const Admin_go = () => {
	const now = new Date();
	return <Navigate to={`/admin/main/${now.getFullYear()}`} replace />;
};

const Survey_intro_go = () => {
	const now = new Date();
	return <Navigate to={`/survey/main/${now.getFullYear()}`} replace />;
};

export const SurveyLayout = ({ children }: { children: React.ReactNode }) => {
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

		{
			path: "/survey/end",
			element: <SurveyEnd />,
		},
		/* ------------------ 관리자 ------------------ */
		{
			path: "/admin",
			element: <Admin_go />,
		},
		{
			path: "/admin/main",
			element: <Admin_go />,
		},
		{
			path: "/admin/main/:surveyYear",
			element: <AdminSettings />,
		},
		{
			path: "/admin/:surveyType",
			element: <AdminSurveyHome_go />,
		},
		{
			path: "/admin/:surveyType/:surveyPage",
			element: <AdminQuestionEditor />,
		},
		{
			path: "/admin/:surveyType/result/:surveyPage",
			element: <AdminResults />,
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
		basename: "/hr_survey",
	}
);

export default router;
