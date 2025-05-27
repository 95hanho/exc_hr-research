/* 단순 문항보기 페이지 */
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { surveyQuestionTestFail, surveyQuestionTestSuccess, useSurveyQuestionTest } from "../hooks/survey/useSurveyQuestionTest.js";
import { EtcTextareaQuestion, EtcTextQuestion, MultiChoiceQuestion, MultiTableQuestion, Munhang } from "../types/survey.js";
import MultiTable_view from "../components/questionType_view/MultiTable_view.js";
import MultiChoice_view from "../components/questionType_view/MultiChoice_view.js";
import EtcText_view from "../components/questionType_view/EtcText_view.js";
import EtcTextarea_view from "../components/questionType_view/EtcTextarea_view.js";
import SurveyQuestionPageFooter from "../components/survey/SurveyQuestionPageFooter.js";

export default function SurveyQuestionPage_view() {
	const { surveyType, surveyPage } = useParams() as { surveyType: string; surveyPage: string };
	const surveyPageNum: number = Number(surveyPage);

	const location = useLocation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { data: surveyQuestionTest, isSuccess, isError, refetch } = useSurveyQuestionTest(surveyType, surveyPage);

	const [top_menuList, set_top_menuList] = useState<string[]>([]); // 설문페이지리스트
	let R_num: number = 0;
	const [munhangs, set_munhangs] = useState<Munhang[]>([]); // 질문문항들

	const handleSurveyData = useCallback(() => {
		if (!surveyQuestionTest) return;
		const data: surveyQuestionTestSuccess | surveyQuestionTestFail = surveyQuestionTest;
		if (data.code === 200) {
			set_top_menuList(data.data.top_menuList);
			set_munhangs([...data.data.munhangs]);
		} else if (data.code === 406) {
			dispatch({ type: "modal/on_modal_alert", payload: data.msg });
			navigate(`/survey/view/${surveyType}`, { replace: true });
		}
	}, [surveyQuestionTest, dispatch, navigate, surveyType]);

	useEffect(() => {
		if (isSuccess && surveyQuestionTest) {
			handleSurveyData();
		} else if (isError) {
			dispatch({ type: "modal/on_modal_alert", payload: "잘 못된 접근입니다." });
			navigate(`/survey/view/${surveyType}`, { replace: true });
		}
		return () => {
			set_munhangs([]);
		};
	}, [location.pathname, isSuccess, surveyQuestionTest, handleSurveyData, isError, dispatch, navigate, surveyType]);

	useEffect(() => {
		refetch(); // 페이지 바뀌면 무조건 요청
	}, [location.pathname, refetch]);

	return (
		<div id="surveyHome">
			<div>
				<h1 style={{ textAlign: "center" }}>테스트뷰</h1>
				<header className="top_menu">
					{top_menuList.map((cont, index) => (
						<a
							href="#"
							key={"top_menu" + index}
							className={surveyPageNum == index + 1 ? "-active" : ""}
							onClick={(e) => {
								e.preventDefault();
								navigate(`/survey/view/${surveyType}/${index + 1}`);
							}}
						>
							{cont}
						</a>
					))}
				</header>
				<form
					name="form"
					method="post"
					onSubmit={(e) => {
						e.preventDefault();
					}}
				>
					<div className="page">
						<header className="page_header">
							<b>{top_menuList[surveyPageNum - 1]}</b>
						</header>
						<>
							<div className="page_body">
								{munhangs.length > 0 &&
									(() => {
										return munhangs.map((munhang, mIdx) => {
											return (
												<section key={"munhang" + mIdx} className={`flex munhang`}>
													<div className="tit-col">
														<h3
															dangerouslySetInnerHTML={{
																__html: `${mIdx + 1}. ${munhang.title}`,
															}}
														/>
													</div>
													<div className="desc-col">
														{munhang.mainTitle && (
															<div className="ask_t1" dangerouslySetInnerHTML={{ __html: munhang.mainTitle }}></div>
														)}
														{munhang.mainAlert && (
															<div
																className={"alert bg-" + munhang.mainAlert.color}
																dangerouslySetInnerHTML={{ __html: munhang.mainAlert.content }}
															></div>
														)}
														{munhang.questions.map((question, qIdx) => {
															R_num++;
															const commonProps = {
																R_num,
															};
															return (
																<div key={"question" + qIdx} id={`R_${R_num}`} className={`question`}>
																	<h1>R_{R_num} 번</h1>
																	<div className={`${question.subPadding ? "ask_wr" : "mt"}`}>
																		<div
																			className="ask_t1"
																			dangerouslySetInnerHTML={{
																				__html: question.title,
																			}}
																		></div>
																		{question.qType === "MultiTable" && (
																			<MultiTable_view
																				subContents={(question as MultiTableQuestion).subContents}
																				{...commonProps}
																			/>
																		)}
																		{question.qType === "MultiChoice" && (
																			<MultiChoice_view
																				subContents={(question as MultiChoiceQuestion).subContents}
																				{...commonProps}
																			/>
																		)}
																		{question.qType === "EtcText" && (
																			<EtcText_view
																				subContents={(question as EtcTextQuestion).subContents}
																				{...commonProps}
																			/>
																		)}
																		{question.qType === "EtcTextarea" && (
																			<EtcTextarea_view
																				subContents={(question as EtcTextareaQuestion).subContents}
																				{...commonProps}
																			/>
																		)}
																	</div>
																	{question.alert && (
																		<div
																			className={`alert bg-${question.alert.color}`}
																			dangerouslySetInnerHTML={{
																				__html: question.alert.content,
																			}}
																		/>
																	)}
																</div>
															);
														})}
													</div>
												</section>
											);
										});
									})()}
							</div>
						</>
					</div>
				</form>
			</div>
			<SurveyQuestionPageFooter />
			{/* <div className="btn_foot">
				<div className="btn_foot_wr"></div>
			</div> */}
		</div>
	);
}
