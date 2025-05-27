import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/* 설문 종료 */
export default function SurveyEnd() {
	const location = useLocation();
	const navigate = useNavigate();
	const surveyType = location?.state?.surveyType || "";

	const otherSuveyName = useMemo(() => {
		if (surveyType.startsWith("hrd")) return "채용";
		else return "개발";
	}, [surveyType]);

	const moveOtherSurvey = () => {
		if (surveyType.startsWith("hrd")) navigate(`/survey/${surveyType.replace("hrd", "hrm")}`, { replace: true });
		else navigate(`/survey/${surveyType.replace("hrm", "hrd")}`, { replace: true });
	};

	useEffect(() => {
		if (!surveyType) {
			navigate("/survey");
		}
	}, [surveyType, navigate]);

	return (
		<div id="surveyEnd">
			<div>
				<img src={`https://research.exc.co.kr/RAC/end.jpg`} />
				<div>
					<button
						className="btn btn-info"
						onClick={() => {
							moveOtherSurvey();
						}}
					>
						{otherSuveyName} 설문 하러가기
					</button>
				</div>
			</div>
		</div>
	);
}
