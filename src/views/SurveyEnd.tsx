/* 설문 종료 */
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSurveyRequestManager } from "../hooks/survey/useSurveyRequestManager";
import { useSurveySetRequestManager } from "../hooks/survey/useSurveySetRequestManager";
import { useAppDispatch } from "../hooks/useRedux";

export default function SurveyEnd() {
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const surveyType = location?.state?.surveyType || "";
	const email = location?.state?.email || "";
	const { isSuccess, data: surveyRequestManager } = useSurveyRequestManager(email, surveyType);
	const { mutate: setSurveyRequestManager } = useSurveySetRequestManager();

	const [manager, set_manager] = useState("");

	const otherSuveyName = useMemo(() => {
		if (surveyType.startsWith("hrd")) return "채용";
		else return "개발";
	}, [surveyType]);

	const store_manager = (e: FormEvent) => {
		e.preventDefault();
		setSurveyRequestManager(
			{ email, name: manager, surveyType },
			{
				onSuccess() {
					dispatch({ type: "modal/on_modal_alert", payload: "저장완료되었습니다." });
				},
			}
		);
	};

	const moveOtherSurvey = () => {
		if (surveyType.startsWith("hrd")) navigate(`/survey/${surveyType.replace("hrd", "hrm")}`, { replace: true });
		else navigate(`/survey/${surveyType.replace("hrm", "hrd")}`, { replace: true });
	};

	useEffect(() => {
		if (!surveyType) {
			navigate("/survey");
			dispatch({ type: "modal/on_modal_alert", payload: "잘못된 경로로 접근하셨습니다." });
		} else {
			if (isSuccess && surveyRequestManager) {
				const data = surveyRequestManager;
				set_manager(data.result);
			}
		}
	}, [surveyType, navigate, dispatch, isSuccess, surveyRequestManager]);

	return (
		<div id="surveyEnd">
			<div>
				<img src={`https://research.exc.co.kr/RAC/end.jpg`} />
				<div className="manager-reinput">
					<form onSubmit={store_manager}>
						<h4>설문 요청담당자를 한 번 더 확인해주세요.</h4>
						<div>
							<input type="text" value={manager} onChange={(e) => set_manager(e.target.value)} />
							<button className="btn btn-success">저장</button>
						</div>
					</form>
				</div>
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
