import styled from "@emotion/styled";

const HeaderImage = styled.div<{ bgUrl: string; surveyYear: string }>`
	height: ${(props) => (props.surveyYear === "2025" ? "510px" : "591px")};
	background: url(${(props) => props.bgUrl}) center center / cover no-repeat;
`;

export default function SurveyTop({ surveyYear }: { surveyYear: string }) {
	const timestamp = new Date().getTime();

	return (
		// ?v=${timestamp}
		<HeaderImage className="header-img" bgUrl={`https://research.exc.co.kr/RAC/${surveyYear}_img/main_top_bg.png`} surveyYear={surveyYear}>
			<img src={`https://research.exc.co.kr/RAC/${surveyYear}_img/main_top.png?v=${timestamp}`} alt="12321" />
		</HeaderImage>
	);
}
