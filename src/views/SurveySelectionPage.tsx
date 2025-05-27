/* 설문선택 페이지 */
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import gateBack from "/template/images/gate_bg.png";
import gate_hrd from "/template/images/gate_btn_01.png";
import gate_hrm from "/template/images/gate_btn_02.png";
import { useDispatch } from "react-redux";
import SurveyTop from "../components/survey/SurveyTop";
import SurveyFooter from "../components/survey/SurveyFooter";
import styled from "@emotion/styled";
import { useAppSelector } from "../hooks/useRedux";

const SurveyButtonContainer = styled.div<{ bg: string }>`
	background: url(${(props) => props.bg}) 50% 50% / auto no-repeat;
	height: 338px;
	margin: 20px 0;
	align-content: center;
`;

const SurveyButtonWrap = styled.div`
	width: 1080px;
	margin: 0 auto;
	padding-top: 20px;
`;

const SurveyButton = ({
	title,
	round,
	image,
	path,
	endStatus,
}: {
	title: string;
	round: number;
	image: string;
	path: string;
	endStatus?: boolean;
}) => {
	const navigate = useNavigate();
	return (
		<button onClick={() => !endStatus && navigate(path)}>
			<h2>제{round}회</h2>
			<h1>{title}</h1>
			<div>{endStatus !== undefined ? endStatus ? <p className="c_red">설문 준비중입니다</p> : <img src={image} alt="" /> : null}</div>
		</button>
	);
};

export default function SurveySelectionPage() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { surveyYear } = useParams() as { surveyYear: string };
	const commonInfo = useAppSelector((state) => state.common.commonInfo);

	useEffect(() => {
		if (!commonInfo.isExist) navigate("/NotPage", { replace: true });
	}, [commonInfo, navigate]);
	useEffect(() => {
		dispatch({ type: "common/change_curYear", payload: surveyYear });
	}, [dispatch, surveyYear]);

	return (
		<>
			<div id="surveyIntro">
				<SurveyTop surveyYear={surveyYear} />
				<SurveyButtonContainer className="servey-btn" bg={gateBack}>
					<SurveyButtonWrap>
						<SurveyButton
							title="인재개발 실태조사"
							round={Number(surveyYear) - 2004}
							image={gate_hrd}
							path={`/survey/hrd_${surveyYear}`}
							endStatus={commonInfo.endStatus}
						/>
						<SurveyButton
							title="인재채용 실태조사"
							round={Number(surveyYear) - 2020}
							image={gate_hrm}
							path={`/survey/hrm_${surveyYear}`}
							endStatus={commonInfo.endStatus}
						/>
					</SurveyButtonWrap>
				</SurveyButtonContainer>
				<SurveyFooter surveyYear={surveyYear} />
			</div>
		</>
	);
}
