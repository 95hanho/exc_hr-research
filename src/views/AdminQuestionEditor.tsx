/* 관리자 설문 문항 설정 */
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useCallback, useEffect, useReducer, useState } from "react";
import AllLoding from "../components/AllLoding.js";
import { ResultData } from "../types/survey.js";
import { useAppDispatch } from "../hooks/useRedux.js";
import { useAdminSetSurveyQuestion } from "../hooks/admin/useAdminSetSurveyQuestion.js";
import { useAdminSurveyQuestion } from "../hooks/admin/useAdminSurveyQuestion.js";
import { useAdminSurveyTableMake } from "../hooks/admin/useAdminSurveyTableMake.js";
import { MultiChoiceSubContents, MultiTableSubContents, Question } from "../types/question.js";

import RequiredSetting from "../components/admin/RequiredSetting.js";
import requiredListReducer from "../components/admin/requiredListReducer.js";
import MunhangEditor from "../components/admin/MunhangEditor.js";
import munhangsReducer from "../components/admin/munhangsReducer.js";
import MunhangTopMenu from "../components/admin/MunhangTopMenu.js";

export default function AdminQuestionEditor() {
	const { surveyType, surveyPage } = useParams() as { surveyType: string; surveyPage: string };
	const surveyPageNum = Number(surveyPage);
	let urlType = "";
	let sYear = "";
	if (surveyType) {
		urlType = surveyType.split("_")[0];
		sYear = surveyType.split("_")[1];
	}
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { mutate: setQuestion } = useAdminSetSurveyQuestion();
	const { isSuccess, data: questionData, isError, error } = useAdminSurveyQuestion(surveyType, surveyPage);
	const { mutate: surveyTableMake } = useAdminSurveyTableMake();

	// 로딩
	const [loding, set_loding] = useState(false);

	// 가장 위 메뉴
	const [top_menuList, set_top_menuList] = useState<string[]>([]); //
	const [munhangs, munhangsDispatch] = useReducer(munhangsReducer, []);
	const [initData, set_initData] = useState<ResultData>({}); // 초기데이터 문항만들면 자동으로 만들어짐

	// required 설정
	const [requiredList, reqListDispatch] = useReducer(requiredListReducer, []);
	// 결과 테이블에 저장된 데이터가 있는지
	const [hasTableData, set_hasTableData] = useState<boolean>(false);

	// 초기데이터 제작
	const change_initData = (): ResultData => {
		let obj = {};
		munhangs.forEach((munhang) => {
			munhang.questions.forEach((question) => {
				obj = {
					...obj,
					...initData_make(question.R_num, question.qType, question.subContents),
				};
			});
		});
		set_initData(obj);
		return obj;
	};
	// 초기데이터 만들기!!
	const initData_make = (rNum: number, qType: Question["qType"], subCont: Question["subContents"]) => {
		const arr = [];
		if (qType === "MultiTable") {
			const sc = subCont as MultiTableSubContents;
			if (sc.table_th instanceof Array) {
				sc.table_th.map((th, thIdx) => {
					if (th === "R_etc") arr.push(`R_${rNum}_th_${thIdx + 1}_etc`);
				});
			}
			sc.table_td.map((tr: string[], trIdx: number) => {
				tr.map((td, tdIdx) => {
					if (
						td === "R_per" ||
						td === "R_wei" ||
						td === "R_people" ||
						td === "R_year" ||
						td === "R_won" ||
						td === "R_time" ||
						td === "R_term"
					) {
						arr.push(`R_${rNum}_${trIdx + 1}_${tdIdx + 1}`);
					} else if (td === "R_check") {
						const tableSubCont = subCont as MultiTableSubContents;
						arr.push(`R_${rNum}_n_${tdIdx + 1}_che`);
						if (tableSubCont.checkType == 3) {
							arr.push(`R_${rNum}_cheOrder`);
						}
					} else if (td === "R_relCheck") {
						arr.push(`R_${rNum}_n_${tdIdx + 1}_f`);
						arr.push(`R_${rNum}_n_${tdIdx + 1}_b`);
					} else if (td === "R_relWeight") {
						arr.push(`R_${rNum}_n_${tdIdx + 1}_fWei`);
						arr.push(`R_${rNum}_${trIdx + 1}_${tdIdx + 1}_bWei`);
					} else if (td === "R_radio") {
						arr.push(`R_${rNum}_n_${tdIdx + 1}_rad`);
					} else if (td === "R_increDecre") {
						arr.push(`R_${rNum}_n_${tdIdx + 1}`);
					} else if (td === "R_increDecre2") {
						arr.push(`R_${rNum}_n_${tdIdx + 1}`);
					} else if (td === "R_etc") {
						arr.push(`R_${rNum}_${trIdx + 1}_etc`);
					}
				});
			});
		} else if (qType === "MultiChoice") {
			const sc = subCont as MultiChoiceSubContents;
			arr.push(`R_${rNum}_multi`);
			sc.choices?.map((v) => {
				if (v.content === "R_etc") arr.push(`R_${rNum}_etc`);
			});
		} else if (qType === "EtcText") {
			arr.push(`R_${rNum}_etc`);
		} else if (qType === "EtcTextarea") {
			arr.push(`R_${rNum}_etc`);
		}
		const obj: Record<string, string> = {};
		arr.map((v) => {
			obj[v] = "";
		});
		return obj;
	};

	// required 검사
	const required_checked = () => {
		for (const required of requiredList) {
			if (!required.attr) {
				required_alert();
				return false;
			}
			if (required.values.some((v) => !v)) {
				required_alert();
				return false;
			}
			if (required.hide.some((v) => !v)) {
				required_alert();
				return false;
			}
		}
		function required_alert() {
			dispatch({ type: "modal/on_modal_alert", payload: "required 설정을 채워주세요." });
		}
		return true;
	};
	// 설문정보 저장하기
	const store_surveyInfo = () => {
		if (!required_checked()) return false;
		let emptyIndex = -1;
		if (
			top_menuList.some((v, i) => {
				if (!v) emptyIndex = i;
				return !v;
			})
		) {
			dispatch({ type: "modal/on_modal_alert", payload: "모든 헤더메뉴 이름을 채워주세요." });
			document.getElementById(`top_menu_${emptyIndex}`)?.focus();
		} else {
			const newInitData = change_initData();

			const param_obj = {
				surveyType,
				surveyPage,
				top_menuList,
				head_title: top_menuList[surveyPageNum - 1],
				requiredList,
				munhangs,
				initData: newInitData,
			};
			setQuestion(param_obj, {
				onSuccess(data) {
					if (data.code === 200) dispatch({ type: "modal/on_modal_alert", payload: "저장 완료" });
					else {
						dispatch({ type: "modal/on_modal_alert", payload: "오류 발생" });
					}
				},
			});
		}
		return true;
	};
	// 결과 테이블 만들기
	const create_resultTable = () => {
		if (hasTableData) {
			alert("테이블에 저장된 데이터가 있습니다.\n데이터 백업 및 초기화 후 진행해주세요.");
			return;
		}
		console.log(initData);
		if (confirm("결과 테이블을 만드시겠습니까?")) {
			set_loding(true);
			surveyTableMake(
				{ surveyType, surveyPage, initData },
				{
					onSuccess(data) {
						console.log(data);
					},
					onSettled() {
						console.log(123);
						set_loding(false);
					},
				}
			);
		}
	};

	const init = useCallback(async () => {
		set_loding(true);
		console.log(surveyType, surveyPage);
		if (isSuccess) {
			// code =
			// 4033 : 처음들어왔을 때
			// 4034 :
			// 4035 : 아예없음
			const data = questionData;
			console.log(data);
			if (data.code === 200) {
				set_initData({
					...data.data.initData,
				});
				munhangsDispatch({ type: "init", payload: data.data.munhangs });
				set_top_menuList([...data.data.top_menuList]);
				// if (data.data.requiredList) set_requiredList([...data.data.requiredList]);
				if (data.data.requiredList) reqListDispatch({ type: "init", payload: data.data.requiredList });
				if (data.data.survey_answer_is_record) set_hasTableData(true);
			} else if (data.code === 4033 || data.code === 4034) {
				munhangsDispatch({ type: "empty_init" });
				if (surveyPageNum == 1) set_top_menuList(["기본"]);
			} else if (data.code === 4035) {
				dispatch({ type: "modal/on_modal_alert", payload: "문항 정보가 존재하지 않습니다." });
				navigate(-1);
			} else {
				alert("?????????????");
				console.log("?????????????");
			}
		} else if (isError) {
			console.log(error);
			dispatch({ type: "modal/on_modal_alert", payload: "잘못된 접근입니다." });
			navigate(`/admin/main/${surveyType.substring(surveyType.length - 4, surveyType.length)}`, { replace: true });
		}
		set_loding(false);
	}, [dispatch, error, isError, isSuccess, navigate, questionData, surveyPage, surveyPageNum, surveyType]);

	useEffect(() => {
		init();
		return () => {};
	}, [location.pathname, isSuccess, questionData, init]);

	useEffect(() => {
		if (munhangs.length > 0) munhangsDispatch({ type: "reassign_rnum" });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [munhangs.length, munhangs.map((m) => m.questions.length).join(",")]);

	if (loding) return <AllLoding />;

	return (
		<div id="adminSurveyHome">
			<div>
				<div className={`align_center admin-file`} style={{ height: "194px" }}>
					<img src={`https://research.exc.co.kr/RAC/${sYear}_img/${urlType}_maintop.png?v=${new Date().getTime()}`} alt="사진1 사진없음" />
				</div>
				<MunhangTopMenu
					top_menuList={top_menuList}
					set_top_menuList={set_top_menuList}
					surveyType={surveyType}
					surveyPage={surveyPage}
					store_surveyInfo={store_surveyInfo}
				/>
				<form
					name="form"
					method="post"
					onSubmit={(e) => {
						e.preventDefault();
					}}
				>
					<div className="page" style={{ width: "1400px" }}>
						<RequiredSetting
							requiredList={requiredList}
							reqListDispatch={reqListDispatch}
							initData={initData}
							change_initData={change_initData}
						/>
						<header className="page_header">
							<b>{top_menuList[surveyPageNum - 1]}</b>
						</header>
						<MunhangEditor
							munhangs={munhangs}
							munhangsDispatch={munhangsDispatch}
							initData={initData}
							change_initData={change_initData}
						/>
					</div>
				</form>
			</div>
			<div className="btn_foot">
				<div className="btn_foot_wr">
					<button type="button" className="btn btn-lg btn-danger" onClick={store_surveyInfo}>
						저장하기
					</button>{" "}
					{/* <button type="button" className="btn btn-lg btn-success" onClick={create_resultTable}>
						결과테이블만들기
					</button> */}
					<p>* 자주 저장하여 설정한 것이 날아가지 않게...</p>
				</div>
			</div>
		</div>
	);
}
