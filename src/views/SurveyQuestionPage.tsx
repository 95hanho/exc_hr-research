/* 설문 문항 페이지 */
import { useNavigate, useParams, useLocation } from "react-router-dom";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Cookies } from "react-cookie";
import { useAppDispatch } from "../hooks/useRedux.js";
import { getSurveyToken, target_scrFocus } from "../lib/ui.js";
import { useSurveyStore } from "../hooks/survey/useSurveyStore.js";
import { surveyQuestionFail, surveyQuestionSuccess, useSurveyQuestion } from "../hooks/survey/useSurveyQuestion.js";
import { MunhangVisibilityRule, ResultData, SurveyStoreData } from "../types/survey.js";
import useSurveyCustom from "../hooks/surveyCustom/useSurveyCustom.js";
import SurveyQuestionPageFooter from "../components/survey/SurveyQuestionPageFooter.js";
import AllLoding from "../components/AllLoding.js";
import { MultiTableSubContents, Munhang } from "../types/question.js";
import MunhangTopMenu from "../components/survey/MunhangTopMenu.js";
import SurveyMunhangs from "../components/survey/SurveyMunhangs.js";

export default function SurveyQuestionPage() {
	const location = useLocation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { surveyType, surveyPage } = useParams() as { surveyType: string; surveyPage: string };
	const surveyPageNum: number = Number(surveyPage);
	let urlType = "";
	let sYear = "";
	if (surveyType) {
		urlType = surveyType.split("_")[0];
		sYear = surveyType.split("_")[1];
	}
	const cookies = useMemo(() => new Cookies(), []);
	const { mutate: storeSurvey } = useSurveyStore();
	const surveyToken = getSurveyToken(surveyType) || "";
	const [allLoding, set_allLoding] = useState(false);
	const { data: surveyQuestion, isSuccess, isError, isFetching } = useSurveyQuestion(surveyType, surveyPage, surveyToken);

	const [clickPrevent, set_clickPrevent] = useState<boolean>(false);
	const [testView, set_testView] = useState<boolean>(false);
	const [top_menuList, set_top_menuList] = useState<string[]>([]); // 설문페이지리스트
	const [munhangs, set_munhangs] = useState<Munhang[]>([]); // 질문문항들
	const [resultData, set_resultData] = useState<ResultData>({}); // 결과데이터
	const [progress_raw, set_progress_raw] = useState<boolean[]>([]); // 페이지마다 설문완료 여부
	// 문항 보여주기 룰
	const munhangVisibilityRuleRef = useRef<Record<string, MunhangVisibilityRule[]>>({});
	// 가려줄 R_num 리스트
	const hideRNumListRef = useRef<string[]>([]);

	const { customHide, customPass, custom_changeResultData } = useSurveyCustom(surveyType, surveyPageNum);

	// 결과데이터 바꾸기
	const changeResultData = (e?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, addObj?: ResultData): void => {
		let obj = {
			...resultData,
		};
		let newAddObj: ResultData = {};
		if (e) newAddObj[e.target.name] = e.target.value;
		if (addObj) {
			newAddObj = {
				...newAddObj,
				...addObj,
			};
		}
		obj = {
			...obj,
			...newAddObj,
		};
		// 문항 넘어가기 규칙에 따라 문항가리기
		if (
			(e && munhangVisibilityRuleRef.current[e.target.name]) ||
			(newAddObj && Object.keys(newAddObj).some((key) => munhangVisibilityRuleRef.current[key])) ||
			customHide(obj).length > 0
		) {
			const newHideRNumList = setMunhangsVisibilityByAnswer(munhangs, obj);
			if (newHideRNumList) {
				const keys = Object.keys(obj).filter((key) => newHideRNumList.some((rNum) => key.startsWith(`R_${rNum}_`)));
				const resetResult = keys.reduce<Record<string, string>>((acc, cur) => {
					acc[cur] = "";
					return acc;
				}, {});
				obj = {
					...obj,
					...resetResult,
				};
			}
		}
		// customized
		const customized_obj = custom_changeResultData(obj, newAddObj);
		set_resultData(customized_obj);
	};
	//
	// 제출할 수 있는 상태인지 체크
	const resultCheck = useCallback(
		(alertOn: boolean) => {
			let result = true;
			const resultObj: ResultData = { ...resultData };
			for (let mIdx = 0; mIdx < munhangs.length; mIdx++) {
				const munhang = munhangs[mIdx];
				mIdx = Number(mIdx);
				for (let qIdx = 0; qIdx < munhang.questions.length; qIdx++) {
					const question = munhang.questions[qIdx];
					qIdx = Number(qIdx);
					const r_num = question.R_num as number;
					const fMent = `${mIdx + 1}. ${munhang.title}<br>→${qIdx + 1}번 `;
					let checkAttr = Object.keys(resultData).filter((v) => v.startsWith(`R_${r_num}_`));
					// 숨겨진 데이터 null처리
					const targetEl = document.getElementById(`R_${r_num}`);
					if (targetEl?.classList.contains("hide")) {
						checkAttr.map((v) => {
							resultObj[v] = "";
						});
						continue;
					}
					if (question.qType === "MultiTable") {
						const checkTd: MultiTableSubContents["table_td"] = question.subContents.table_td;
						checkAttr = checkAttr.filter((v) => !v.endsWith("_etc"));
						const per_obj: Record<string, number> = {};
						for (const attr of checkAttr) {
							// R_check에서 순서체크에서 사용
							if (attr.endsWith("_cheOrder")) {
								if (!cheOrder_resultCheck()) break;
								continue;
							}
							const splits = attr.split("_");
							const trNum = Number(splits[2] === "n" ? 1 : splits[2]);
							const tdNum = Number(splits[3] === "n" ? 1 : splits[3]);
							const tdType = checkTd[trNum - 1][tdNum - 1];
							if (customPass(resultData, attr /* tdType as MultiTableTdKeyword, checkAttr */)) {
								continue;
							}
							if (tdType === "R_wei" || tdType === "R_increDecre" || tdType === "R_increDecre2" || tdType === "R_radio") {
								const ele = document.getElementById(attr + "_1") as HTMLInputElement | null;
								if (!resultData[attr] && ele && !ele.disabled) {
									result = false;
									alertAndScr(r_num, undefined, fMent, "질문에 응답해주세요.");
									break;
								}
							} else if (tdType === "R_per") {
								const ele = document.getElementById(attr);
								if (ele?.classList.contains("total")) {
									const per_objName = `R_${r_num}_n_${tdNum}`;
									if (ele.classList.contains("end")) {
										per_obj[per_objName] = per_obj[per_objName]
											? per_obj[per_objName] + Number(resultData[attr])
											: Number(resultData[attr]);
										if (per_obj[per_objName] === 0) {
											result = false;
											alertAndScr(r_num, undefined, fMent, "질문의 퍼센트를 입력해주세요.");
											break;
										} else if (per_obj[per_objName] < 100) {
											result = false;
											alertAndScr(r_num, undefined, fMent, "항목 세로 합이 100%가 되도록 해주세요.");
											break;
										}
									} else {
										per_obj[per_objName] = per_obj[per_objName]
											? per_obj[per_objName] + Number(resultData[attr])
											: Number(resultData[attr]);
									}
								} else if (ele?.classList.contains("totalRow")) {
									const per_objName = `R_${r_num}_${trNum}_n`;
									if (ele.classList.contains("end")) {
										per_obj[per_objName] = per_obj[per_objName]
											? per_obj[per_objName] + Number(resultData[attr])
											: Number(resultData[attr]);
										if (per_obj[per_objName] === 0) {
											result = false;
											alertAndScr(r_num, undefined, fMent, "질문의 퍼센트를 입력해주세요.");
											break;
										} else if (per_obj[per_objName] < 100) {
											result = false;
											alertAndScr(r_num, undefined, fMent, "항목 가로 합이 100%가 되도록 해주세요.");
											break;
										}
									} else {
										per_obj[per_objName] = per_obj[per_objName]
											? per_obj[per_objName] + Number(resultData[attr])
											: Number(resultData[attr]);
									}
								} else {
									if (!resultData[attr]) {
										result = false;
										alertAndScr(r_num, attr, fMent, "질문의 텍스트를 입력해주세요.");
										break;
									}
								}
							} else if (["R_people", "R_won", "R_time", "R_term"].includes(tdType)) {
								if (resultData[attr] === "") {
									result = false;
									alertAndScr(r_num, attr, fMent, "질문의 텍스트를 입력해주세요.");
									break;
								}
							} else if (tdType === "R_year") {
								if (!resultData[attr]) {
									result = false;
									alertAndScr(r_num, attr + "_y", fMent, "질문의 텍스트를 입력해주세요.");
									break;
								} else {
									const list = String(resultData[attr]).split("-");
									if (!list[0]) {
										result = false;
										alertAndScr(r_num, attr + "_y", fMent, "질문의 텍스트를 입력해주세요.");
										break;
									} else if (!list[1]) {
										result = false;
										alertAndScr(r_num, attr + "_m", fMent, "질문의 텍스트를 입력해주세요.");
										break;
									}
								}
							} else if (tdType === "R_check") {
								if (
									checkAttr.every((v) => {
										const ele = document.getElementById(v + "_1") as HTMLInputElement | null;
										return !resultData[v] && !ele?.disabled;
									})
								) {
									result = false;
									alertAndScr(r_num, undefined, fMent, "질문에 응답해주세요.");
									break;
								}
								// question.subContents.checkCountrequired
								// question.subContents.checkType == 1
								// 갯수필수 체크가 켜져있다면!
								if (question.subContents.checkCountrequired) {
									if (question.subContents.checkType == 1) {
										const keys = Object.keys(resultData).filter((v) => v.startsWith(`R_${r_num}_`) && v.endsWith("_che"));
										const checkCount = keys.reduce((acc, cur) => {
											const curCount = resultData[cur] ? String(resultData[cur]).split(",").length : 0;
											return acc + curCount;
										}, 0);
										if (question.subContents.checkLimit?.all && question.subContents.checkLimit.all > checkCount) {
											result = false;
											alertAndScr(r_num, undefined, fMent, `${question.subContents.checkLimit?.all}개까지 선택해주세요.`);
											break;
										}
									}
									if (question.subContents.checkType == 2) {
										const limitCountObj = question.subContents.checkLimit;
										const limitCount = limitCountObj?.[attr];
										const checkCount = resultData[attr] ? String(resultData[attr]).split(",").length : 0;
										if (limitCount && limitCount > checkCount) {
											result = false;
											alertAndScr(
												r_num,
												undefined,
												fMent,
												`체크박스 ${Object.keys(limitCountObj).indexOf(attr) + 1}번째 줄을 ${limitCount}개까지 선택해주세요.`
											);
											break;
										}
									}
								}
							} else if (tdType === "R_relCheck") {
								const pickLeng = resultData[attr] ? String(resultData[attr]).split(",").length : 0;
								const fCount = question.subContents.fCount || 0;
								if (attr.endsWith("_f")) {
									if (!resultData[attr]) {
										result = false;
										alertAndScr(r_num, undefined, fMent, "질문에 응답해주세요.");
										break;
									} else if (pickLeng < fCount) {
										result = false;
										alertAndScr(r_num, undefined, fMent, `활용여부를 더 체크해주세요.`);
										break;
									}
								} else if (attr.endsWith("_b")) {
									// const bEle = document.getElementById(`${attr}_${trNum}`);
									const bEle = document.getElementsByClassName(attr);
									let disabled = true;
									for (let i = 0; i < bEle.length; i++) {
										const input = bEle[i] as HTMLInputElement;
										if (!input.disabled) {
											disabled = false;
											break;
										}
									}
									if (!resultData[attr] && !disabled) {
										result = false;
										alertAndScr(r_num, undefined, fMent, "항목 체크에 해당하는 효과성을 체크해주세요.");
										break;
									} else {
										// 숫자제한있을 시
										// const checkList = resultData[attr].split(",");
									}
								}
							} else if (tdType === "R_relWeight") {
								if (attr.endsWith("_fWei")) {
									if (!resultData[attr]) {
										result = false;
										alertAndScr(r_num, undefined, fMent, "질문에 응답해주세요.");
										break;
									} else {
										const checkList = String(resultData[attr]).split(",");
										for (const checkVal of checkList) {
											const name = attr.replace("n", checkVal).replace("_fWei", "_bWei");
											if (!resultData[name]) {
												result = false;
												alertAndScr(r_num, undefined, fMent, "항목에 해당하는 만족도를 체크해주세요.");
												break;
											}
										}
									}
								}
							}
							// 나머지 증가증감, 가중치
							else {
								const ele = document.getElementById(attr) as HTMLInputElement | null;
								if (!resultData[attr] && !ele?.disabled) {
									result = false;
									alertAndScr(r_num, undefined, fMent, "질문에 응답해주세요.");
									break;
								}
							}
							// R_check에서 순서체크에서 사용
							function cheOrder_resultCheck() {
								const subCont = question.subContents as MultiTableSubContents;
								const maxOrder = subCont.checkLimit?.maxOrder || 1;
								const checkCount = resultData[attr] ? String(resultData[attr]).split(",").length : 0;
								if (maxOrder > checkCount) {
									result = false;
									alertAndScr(r_num, undefined, fMent, `${maxOrder}개까지 선택해주세요.`);
									return false;
								}
								return true;
							}
						}
						if (!result) break;
					} else if (question.qType === "MultiChoice") {
						const pick = checkAttr.filter((v) => !v.endsWith("_etc"))[0];
						const etc = checkAttr.filter((v) => v.endsWith("_etc"))[0];
						const etcEle = document.getElementById(etc) as HTMLInputElement | null;
						if (!resultData[pick]) {
							result = false;
							alertAndScr(r_num, undefined, fMent, "질문에 응답해주세요.");
							break;
						}
						if (etcEle && !etcEle.disabled && !resultData[etc]) {
							result = false;
							alertAndScr(r_num, etc, fMent, "기타 텍스트를 입력 해주세요.");
							break;
						}
						if (question.subContents.requiredCount) {
							const pickList = String(resultData[pick]).split(",");
							const count = question.subContents.count || 0;
							if (count > pickList.length) {
								result = false;
								alertAndScr(r_num, undefined, fMent, "응답 갯수가 부족합니다.");
								break;
							}
						}
					} else if (question.qType === "EtcText") {
						if (!resultData[checkAttr[0]]) {
							result = false;
							alertAndScr(r_num, checkAttr[0], fMent, "질문에 응답해주세요.");
							break;
						}
					} else if (question.qType === "EtcTextarea") {
						if (question.subContents.requiredTxt && !resultData[checkAttr[0]]) {
							result = false;
							alertAndScr(r_num, checkAttr[0], fMent, "질문에 응답해주세요.");
							break;
						}
					}
				}
				if (!result) break;
			}
			if (!result) {
				return { status: false, obj: resultObj };
			} else {
				return { status: true, obj: resultObj };
			}
			function alertAndScr(rNum: number, focusId: string | undefined, fment: string, bment: string) {
				if (alertOn) {
					target_scrFocus(focusId || `R_${rNum}`, "surveyHome");
					dispatch({ type: "modal/on_modal_alert", payload: fment + bment });
				}
			}
		},
		[customPass, dispatch, munhangs, resultData]
	);

	// 중간저장
	const dataSave = useCallback(async () => {
		const result = resultCheck(false);
		const list = [...progress_raw];
		if (!result.status) {
			progress_raw[surveyPageNum - 1] = false;
			list[surveyPageNum - 1] = false;
			set_progress_raw([...list]);
		}
		storeSurvey(
			{
				surveyType,
				surveyPage: surveyPageNum,
				resultInfoData: {
					...result.obj,
					progress_raw: JSON.stringify(list),
				},
				surveyToken,
			},
			{
				onSuccess: () => {
					dispatch({ type: "modal/on_modal_alert", payload: "저장완료되었습니다." });
				},
			}
		);
	}, [dispatch, progress_raw, resultCheck, storeSurvey, surveyPageNum, surveyToken, surveyType]);
	// 결과데이터 제출
	const submit_resultData = async () => {
		const result = resultCheck(true);
		if (!result.status) return false;
		else {
			const list = [...progress_raw];
			progress_raw[surveyPageNum - 1] = true;
			list[surveyPageNum - 1] = true;
			set_progress_raw([...list]);
			const obj: SurveyStoreData = {
				...result.obj,
				progress_raw: JSON.stringify(list),
			};
			let end = false;
			if (surveyPageNum == list.length && list.every((v) => v)) {
				end = true;
				obj.end = end;
			}
			storeSurvey(
				{
					surveyType,
					surveyPage: surveyPageNum,
					resultInfoData: obj,
					surveyToken,
				},
				{
					onSuccess: () => {
						if (end) {
							if (surveyType) cookies.remove(surveyType);
							navigate(`/survey/end`, {
								state: {
									surveyType,
									email: location.state.email,
								},
							});
						} else {
							dispatch({ type: "modal/on_modal_alert", payload: "저장완료되었습니다." });
						}
					},
				}
			);
			return true;
		}
	};

	// requiredList(질문가림조건)에 따른 munhang 새로고침
	const setMunhangsVisibilityByAnswer = useCallback(
		(in_munhangs: Munhang[], in_resultData: ResultData): string[] | undefined => {
			let result;
			const newMunhangs = in_munhangs.map((munhang) => ({
				...munhang,
				questions: munhang.questions.map((q) => ({ ...q })), // question 객체까지 깊은 복사 - 안하면 오류남
			}));

			// munhang 숨길 R_num 리스트 만듬
			const newHideRNumList: string[] = Object.entries(munhangVisibilityRuleRef.current).reduce<string[]>((acc, [key, ruleList]) => {
				const result = in_resultData[key];
				for (let i = 0; i < ruleList.length; i++) {
					const rule = ruleList[i];
					if (rule.values.some((v: string) => v == result)) {
						acc.push(...rule.hide);
					}
				}

				return acc;
			}, []);

			const customHideList = customHide(in_resultData);
			if (customHideList.length > 0) {
				newHideRNumList.push(...customHideList);
			}

			// 순서 맞추고 길이가 다르거나 요소가 같지않으면 실행함. 처음엔 그냥 실행됨.
			newHideRNumList.sort((a, b) => Number(a) - Number(b));

			const isEqual =
				newHideRNumList.length === hideRNumListRef.current.length && newHideRNumList.every((v, i) => v == hideRNumListRef.current[i]);
			if (!isEqual) {
				hideRNumListRef.current = newHideRNumList;
				newMunhangs.forEach((munhang) => {
					let hideCount = 0;
					munhang.questions.forEach((question) => {
						if (newHideRNumList.some((v) => Number(v) == question.R_num)) {
							question.hide = true;
							hideCount++;
						} else {
							question.hide = false;
						}
					});
					munhang.mainHide = hideCount === munhang.questions.length;
				});

				result = newHideRNumList;
			}
			set_munhangs(newMunhangs);
			return result;
		},
		[customHide]
	);

	// 설문 데이터 가져오기
	const isSurveyDataHandledRef = useRef(false);
	const handleSurveyData = useCallback(
		(surveyQuestion: surveyQuestionSuccess | surveyQuestionFail) => {
			if (surveyQuestion.code === 200) {
				const surveyData = surveyQuestion.data;
				if (surveyPageNum == 0) {
					if (!surveyData.progress_raw)
						navigate(`/survey/${surveyType}/1`, {
							replace: true,
							state: {
								email: location.state?.email,
							},
						});
					else {
						const haveToPage = surveyData.progress_raw.indexOf(false);
						const goPage = haveToPage == -1 ? surveyData.progress_raw.length - 1 : haveToPage;
						dispatch({
							type: "modal/on_modal_alert",
							payload: "해당 이메일로 저장된 설문이 있습니다.<br>저장된 설문 위치로 이동합니다.",
						});
						navigate(`/survey/${surveyType}/${goPage + 1}`, {
							replace: true,
							state: {
								email: location.state?.email,
							},
						});
					}
				} else {
					set_top_menuList(surveyData.top_menuList);
					if (!surveyData.progress_raw) set_progress_raw(new Array(surveyData.top_menuList.length).fill(false));
					else set_progress_raw(surveyData.progress_raw);
					const progress_raw_checkIdx = surveyData.progress_raw ? surveyData.progress_raw.slice(0, surveyPageNum - 1).indexOf(false) : -1;
					if (progress_raw_checkIdx !== -1 && progress_raw_checkIdx < surveyPageNum - 1) {
						if (testView) console.log(testView);
						if (!testView) {
							dispatch({
								type: "modal/on_modal_alert",
								payload: "설문을 순서대로 진행해주세요.",
							});
							navigate(`/survey/${surveyType}/${progress_raw_checkIdx + 1}`, {
								state: {
									email: location.state?.email,
								},
							});
							return;
						}
					}
					const newResultData = { ...surveyData.initData, ...surveyData.store_data };
					set_resultData(newResultData);
					munhangVisibilityRuleRef.current = { ...surveyData.munhangVisibilityRule };
					setMunhangsVisibilityByAnswer([...surveyData.munhangs], newResultData);
					setTimeout(() => {
						custom_changeResultData(newResultData, undefined, true);
					}, 1000);
				}
			} else if (surveyQuestion.msg) {
				dispatch({ type: "modal/on_modal_alert", payload: surveyQuestion.msg });
				navigate(`/survey/${surveyType}`, { replace: true });
			} else {
				dispatch({ type: "modal/on_modal_alert", payload: "알 수 없는 오류.<br  />담당자에게 문의바랍니다." });
				navigate(`/survey/${surveyType}`, { replace: true });
			}
		},
		[navigate, dispatch, surveyType, surveyPageNum, testView, setMunhangsVisibilityByAnswer, custom_changeResultData, location.state?.email]
	);

	useEffect(() => {
		// surveyQuestion 데이터가 준비된 이후 실행
		if (!surveyToken || !location.state?.email) {
			dispatch({
				type: "modal/on_modal_alert",
				payload: "세션이 만료되었습니다.<br>이메일을 다시 입력해주세요.",
			});
			navigate(`/survey/${surveyType}`, { replace: true });
			return;
		}
		if (isSuccess && surveyQuestion && !isSurveyDataHandledRef.current) {
			handleSurveyData(surveyQuestion);
			isSurveyDataHandledRef.current = true;
		} else if (isError) {
			dispatch({ type: "modal/on_modal_alert", payload: "잘 못된 접근입니다." });
			navigate(`/survey/${surveyType}`, { replace: true });
		}
		set_allLoding(false);
		return () => {
			set_resultData({});
			munhangVisibilityRuleRef.current = {};
			hideRNumListRef.current = [];
			set_munhangs([]);
			isSurveyDataHandledRef.current = false; // 페이지 떠날 때는 리셋
		};
	}, [dispatch, handleSurveyData, isError, isSuccess, navigate, surveyQuestion, surveyToken, surveyType, location.state?.email]);
	useEffect(() => {
		if (isFetching) set_allLoding(true);
		else set_allLoding(false);
	}, [isFetching]);

	const testEnd = () => {
		cookies.remove("marking", { path: "/" });
		set_testView(false);
		navigate(`/survey/${surveyType}/1`, {
			state: {
				email: location.state?.email,
			},
		});
	};

	useEffect(() => {
		const urlSearch = new URLSearchParams(location.search);
		if (urlSearch.get("mark") === "on") {
			set_testView(true);
			cookies.set("marking", "on", { path: "/", expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), secure: true });
			dispatch({ type: "modal/on_modal_alert", payload: "문항번호가 표시되며<br />페이지 이동 시 입력검사가 제외됩니다." });
		} else if (cookies.get("marking") === "on") {
			set_testView(true);
			dispatch({ type: "modal/on_modal_alert", payload: "문항번호가 표시되며<br />페이지 이동 시 입력검사가 제외됩니다." });
		}
	}, [cookies, location.search, dispatch]);

	return (
		<div id="surveyHome">
			<div>
				{testView && surveyType !== "test" && (
					<div style={{ textAlign: "center" }} onClick={testEnd}>
						<button className="btn btn-warning">문항번호 표시 종료</button>
					</div>
				)}
				<div className="align_center" style={{ height: "194px" }}>
					<img src={`https://research.exc.co.kr/RAC/${sYear}_img/${urlType}_maintop.png?v=${new Date().getTime()}`} alt="" />
				</div>
				<p className="email-mark">설문 이메일 : {location.state?.email}</p>
				<MunhangTopMenu
					top_menuList={top_menuList}
					surveyPageNum={surveyPageNum}
					surveyType={surveyType}
					testView={testView}
					email={location.state?.email}
					clickPrevent={clickPrevent}
					set_clickPrevent={set_clickPrevent}
					dataSave={dataSave}
					submit_resultData={submit_resultData}
					progress_raw={progress_raw}
				/>
				{allLoding ? (
					<AllLoding />
				) : (
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
							<SurveyMunhangs munhangs={munhangs} resultData={resultData} changeResultData={changeResultData} testView={testView} />
						</div>
					</form>
				)}
			</div>
			<SurveyQuestionPageFooter />
			{!allLoding && (
				<div className="btn_foot">
					<div className="btn_foot_wr">
						<button
							type="button"
							className="btn btn-lg btn-info"
							onClick={() => {
								if (!clickPrevent) {
									set_clickPrevent(true);
									setTimeout(() => {
										set_clickPrevent(false);
									}, 2000);
									dataSave();
								} else {
									dispatch({ type: "modal/on_modal_alert", payload: "잠시만 기다려주세요." });
								}
							}}
						>
							중간 저장
						</button>{" "}
						<button
							type="button"
							className="btn btn-lg btn-danger"
							onClick={() => {
								if (!clickPrevent) {
									set_clickPrevent(true);
									setTimeout(() => {
										set_clickPrevent(false);
									}, 2000);
									submit_resultData().then((result) => {
										if (result && surveyPageNum < top_menuList.length) {
											navigate(`/survey/${surveyType}/${surveyPageNum + 1}`, {
												state: {
													email: location.state?.email,
												},
											});
										}
									});
								} else {
									dispatch({ type: "modal/on_modal_alert", payload: "잠시만 기다려주세요." });
								}
							}}
						>
							{surveyPageNum < top_menuList.length ? "다음페이지" : "최종제출"}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
