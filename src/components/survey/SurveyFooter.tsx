import styled from "@emotion/styled";

const Footer = styled.div`
	padding: 30px 0;
	text-align: center;
	background-color: #efefef;
`;

export default function SurveyFooter({ surveyYear }: { surveyYear: string }) {
	return (
		<Footer>
			<img src={`https://research.exc.co.kr/RAC/${surveyYear}_img/footer_info.png?v=${new Date().getTime()}`} alt="" />
		</Footer>
	);
}
