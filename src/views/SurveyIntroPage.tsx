/* 설문상세소개, 이메일입력 후 시작 페이지 */
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SurveyTop from "../components/survey/SurveyTop";
import Survey_footer from "../components/survey/SurveyFooter";
import { useAppDispatch, useAppSelector } from "../hooks/useRedux";
import { useSurveyStart } from "../hooks/survey/useSurveyStart";
// import { useSurveyInfo } from "../hooks/survey/useSurveyInfo";
import { setSurveyToken } from "../lib/ui";

export default function SurveyIntroPage() {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { surveyType } = useParams() as { surveyType: string };
	const commonInfo = useAppSelector((state) => state.common.commonInfo);
	// const { isError } = useSurveyInfo(surveyType);
	const { mutate: startSurvey } = useSurveyStart();

	let urlType = "";
	let surveyYear = "";
	if (surveyType) {
		urlType = surveyType.split("_")[0];
		surveyYear = surveyType.split("_")[1];
	}

	const [email, set_email] = useState<string>("");
	const emailRef = useRef<HTMLInputElement>(null);

	// 설문시작 전
	const startSurvey_before = () => {
		const email_Regexp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
		if (!email_Regexp.test(email)) {
			dispatch({ type: "modal/on_modal_alert", payload: "잘못 된 이메일 형식입니다." });
			emailRef.current?.focus();
			return;
		}

		startSurvey(
			{ surveyType, email },
			{
				onSuccess: (data: { code: number; result: { token: string } }) => {
					if (data.code === 200) {
						setSurveyToken(surveyType, data.result.token);
						navigate(`/survey/${surveyType}/0`, {
							state: { email },
						});
					} else if (data.code === 406) {
						navigate(`/survey/${surveyType}/info`, {
							state: { email },
						});
					} else if (data.code === 403) {
						dispatch({
							type: "modal/on_modal_alert",
							payload: "설문이 완료된 이메일입니다.<br>감사합니다.",
						});
					} else {
						dispatch({
							type: "modal/on_modal_alert",
							payload: "서버오류<br>담당자 문의 바랍니다.",
						});
					}
				},
				onError: () => {
					dispatch({
						type: "modal/on_modal_alert",
						payload: "서버오류<br>담당자 문의 바랍니다.",
					});
				},
			}
		);
	};
	useEffect(() => {
		dispatch({ type: "common/change_curYear", payload: surveyYear });
	}, [dispatch, navigate, surveyYear]);

	return (
		<>
			<div id="surveyStart">
				<SurveyTop surveyYear={surveyYear} />
				<div className="bottom" style={{ minHeight: "1279px" }}>
					<img src={`https://research.exc.co.kr/RAC/${surveyYear}_img/${urlType}_introBottom.png?v=${new Date().getTime()}`} alt="" />
				</div>
				{commonInfo.adminOn && <h2 className="c_red align_center ">관리자 오픈상태</h2>}
				{!commonInfo.endStatus ? (
					<form
						name="fmResearch"
						action="info_Chk.asp"
						className="startForm"
						onSubmit={(e: FormEvent) => {
							e.preventDefault();
							startSurvey_before();
						}}
					>
						<label htmlFor="R_Email">이메일</label>
						<input
							type="text"
							id="email"
							name="email"
							value={email}
							placeholder="이메일주소를입력하세요"
							onChange={(e: ChangeEvent<HTMLInputElement>) => set_email(e.target.value)}
							ref={emailRef}
						/>
						<button>
							<img src="https://research.exc.co.kr/RAC2023/images/btn_start.png?ver=1" alt="설문시작하기" id="sbm" />
						</button>
					</form>
				) : (
					<h2 className="c_red align_center" style={{ padding: "20px 0" }}>
						- 설문 마감되었습니다. 감사합니다. -
					</h2>
				)}
				<Survey_footer surveyYear={surveyYear} />
			</div>
		</>
	);
}
