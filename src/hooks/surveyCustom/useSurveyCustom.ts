import { useCallback } from "react";
import { ResultData } from "../../types/survey";

// 서베이 커스텀 사항들
export default function useSurveyCustom(surveyType: string, surveyPageNum: number) {
	// 커스텀 -> 질문 숨기기
	const customHide = useCallback(
		(resultData: ResultData) => {
			const result: string[] = [];
			//
			if (surveyType === "hrm_2024" && surveyPageNum == 1) {
				const a = resultData[`R_4_1_2`] && Number(resultData[`R_4_1_2`]);
				const b = resultData[`R_4_1_3`] && Number(resultData[`R_4_1_3`]);
				// if (!a || !b) return false;
				if (a && b) {
					if (a < b) result.push("6");
					else if (a > b) result.push("5");
					else if (a === b) result.push("5", "6");
				}
			}
			//
			if (surveyType === "hrm_2025" && surveyPageNum == 1) {
				const a = resultData[`R_5_1_2`] && Number(resultData[`R_5_1_2`]);
				const b = resultData[`R_5_1_3`] && Number(resultData[`R_5_1_3`]);
				// if (!a || !b) return false;
				if (a && b) {
					if (a > b) result.push("6");
					else if (a < b) result.push("7");
					else if (a === b) result.push("6", "7");
				}
			}
			return result;
		},
		[surveyPageNum, surveyType]
	);

	// 커스텀 -> 결과 데이터 바꾸기
	const custom_changeResultData = useCallback(
		(obj: ResultData, addResultData?: ResultData, isFirstLoad?: boolean) => {
			const newObj = { ...obj };
			//
			if (surveyType === "hrd_2024" && surveyPageNum == 1) {
				if (Object.keys(newObj).some((v) => v.startsWith(`R_8_`))) {
					Object.keys(newObj).map((v) => {
						if (v.startsWith("R_9_")) newObj[v] = "";
					});
				} else if (Object.keys(newObj).some((v) => v.startsWith(`R_9_`))) {
					Object.keys(newObj).map((v) => {
						if (v.startsWith("R_8_")) newObj[v] = "";
					});
				}
			}
			//
			if (
				surveyType === "hrd_2025" &&
				surveyPageNum == 4 &&
				(isFirstLoad || (addResultData && (addResultData["R_1_n_2_che"] != undefined || addResultData["R_1_n_4_che"] != undefined)))
			) {
				const list = String(obj["R_1_n_2_che"]) ? String(obj["R_1_n_2_che"]).split(",") : [];
				const list2 = String(obj["R_1_n_4_che"]) ? String(obj["R_1_n_4_che"]).split(",") : [];
				Object.keys(obj).filter((v) => v.startsWith("R_2_n_2_che_") && v.startsWith("R_2_n_4_che_"));
				document.getElementsByName("R_2_n_2_che").forEach((v) => {
					const el = v as HTMLInputElement;
					el.disabled = false;
				});
				newObj["R_2_n_2_che"] = "";
				document.getElementsByName("R_2_n_4_che").forEach((v) => {
					const el = v as HTMLInputElement;
					el.disabled = false;
				});
				newObj["R_2_n_4_che"] = "";
				list.forEach((v) => {
					const el = document.getElementById(`R_2_n_2_che_${v}`) as HTMLInputElement | null;
					if (el) {
						if (el.checked) {
							el.click();
						}
						el.disabled = true;
					}
				});
				list2.forEach((v) => {
					const el = document.getElementById(`R_2_n_4_che_${v}`) as HTMLInputElement | null;
					if (el) {
						if (el.checked) {
							el.click();
						}
						el.disabled = true;
					}
				});
			}
			//
			const changingR_8 = Object.keys(addResultData || {}).filter((v) => v.startsWith(`R_8_`)).length > 0;
			const changingR_9 = Object.keys(addResultData || {}).filter((v) => v.startsWith(`R_9_`)).length > 0;
			if (surveyType === "hrd_2025" && surveyPageNum == 1 && (isFirstLoad || changingR_8 || changingR_9)) {
				const R_8_list = Object.keys(newObj).filter((v) => v.startsWith(`R_8_`));
				const R_9_list = Object.keys(newObj).filter((v) => v.startsWith(`R_9_`));
				document.querySelectorAll(`[name^="R_8"]`).forEach((v) => {
					const el = v as HTMLInputElement;
					el.disabled = false;
				});
				document.querySelectorAll(`[name^="R_9"]`).forEach((v) => {
					const el = v as HTMLInputElement;
					el.disabled = false;
				});
				if (R_8_list.some((v) => newObj[v] != "")) {
					R_9_list.forEach((v) => (newObj[v] = ""));
					document.querySelectorAll(`[name^="R_9"]`).forEach((v) => {
						const el = v as HTMLInputElement;
						el.disabled = true;
					});
				}
				if (R_9_list.some((v) => newObj[v] != "")) {
					R_8_list.forEach((v) => (newObj[v] = ""));
					document.querySelectorAll(`[name^="R_8"]`).forEach((v) => {
						const el = v as HTMLInputElement;
						el.disabled = true;
					});
				}
			}

			return newObj;
		},
		[surveyPageNum, surveyType]
	);

	// 커스텀 -> 결과체크 넘어가기
	const customPass = (resultData: ResultData, attr?: string /* tdType?: MultiTableTdKeyword, , checkAttr?: string[] */) => {
		//
		if (surveyType === "hrd_2024" && surveyPageNum == 1) {
			if (attr && attr.startsWith(`R_8_`)) {
				if (
					Object.keys(resultData)
						.filter((v) => v.startsWith(`R_9_`))
						.some((v) => resultData[v])
				) {
					return true;
				}
			} else if (attr && attr.startsWith(`R_9_`)) {
				if (
					Object.keys(resultData)
						.filter((v) => v.startsWith(`R_8_`))
						.some((v) => resultData[v])
				) {
					return true;
				}
			}
		}
		//
		if (surveyType === "hrd_2025" && surveyPageNum == 1) {
			if (attr && attr.startsWith(`R_8_`)) {
				if (
					Object.keys(resultData)
						.filter((v) => v.startsWith(`R_9_`))
						.some((v) => resultData[v] != "")
				) {
					return true;
				}
			} else if (attr && attr.startsWith(`R_9_`)) {
				if (
					Object.keys(resultData)
						.filter((v) => v.startsWith(`R_8_`))
						.some((v) => resultData[v] != "")
				) {
					return true;
				}
			}
		}
		return false;
	};

	return {
		customHide,
		custom_changeResultData,
		customPass,
	};
}
