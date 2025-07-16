import { useQuery } from "@tanstack/react-query";
import { get_normal } from "../../lib/apiFilter";
import API_URL from "../../api/endpoints";
import { MunhangVisibilityRule, RequiredHideRule } from "../../types/survey";
import { AxiosResponse } from "axios";
import { Munhang } from "../../types/question";
import { isTest } from "../../lib/test";

export type surveyQuestionSuccess = {
	code: 200;
	data: {
		top_menu_list_jsonData: string;
		jsonData: string;
		//
		head_img_url: string;
		headerTitle: string;
		initData: Record<string, string>;
		munhangs: Munhang[];
		progress_raw: boolean[] | string;
		requiredList: RequiredHideRule[];
		store_data: Record<string, string>;
		top_menuList: string[];
		munhangVisibilityRule: Record<string, MunhangVisibilityRule[]>;
	};
};
export type surveyQuestionFail = {
	code: 406;
	msg: string;
};

// 설문 정보 및 문항 조회
export function useSurveyQuestion(surveyType: string, surveyPage: string, surveyToken: string) {
	return useQuery({
		// 쿼리 키 - 바뀌는 경우 다른 요청으로 인식
		queryKey: ["surveyQuestion", { surveyType, surveyPage, surveyToken }],
		queryFn: (): Promise<AxiosResponse> => {
			return get_normal(API_URL.SURVEY_QUESTION, { surveyType, surveyPage }, { token: surveyToken });
		},
		select: (res: AxiosResponse) => {
			try {
				if (isTest) console.log(res);
				const newData: surveyQuestionSuccess | surveyQuestionFail = { ...res.data };
				if (newData.code === 200) {
					if (typeof newData.data.progress_raw === "string") {
						newData.data.progress_raw = JSON.parse(String(newData.data.progress_raw));
					}
					if (typeof newData.data.jsonData === "string") {
						const obj = JSON.parse(String(newData.data.jsonData));
						newData.data.initData = obj.initData;
						newData.data.munhangs = obj.munhangs;
						newData.data.requiredList = obj.requiredList;
					}
					if (typeof newData.data.store_data === "string") {
						newData.data.store_data = JSON.parse(newData.data.store_data);
					}
					if (typeof newData.data.top_menu_list_jsonData === "string") {
						newData.data.top_menuList = JSON.parse(newData.data.top_menu_list_jsonData).top_menuList;
					}
					if (newData.data.requiredList) {
						const obj: Record<string, MunhangVisibilityRule[]> = {};
						const requiredList = [...newData.data.requiredList];
						requiredList.forEach((v: RequiredHideRule) => {
							if (!obj[v.attr]) {
								obj[v.attr] = [
									{
										hide: v.hide,
										values: v.values,
									},
								];
							} else {
								obj[v.attr].push({
									hide: v.hide,
									values: v.values,
								});
							}
						});
						newData.data.munhangVisibilityRule = obj;
					}
					// R_num 달아주기
					let rNum = 0;
					if (newData.data.munhangs) {
						newData.data.munhangs.forEach((munhang) => {
							munhang.questions.map((question) => {
								rNum++;
								question.R_num = rNum;
							});
						});
					}
				}
				return newData;
			} catch (err) {
				console.log(err);
				throw err; // 꼭 throw 해야 React Query가 인식함
			}
		},
		// 해당 쿼리를 실행할지 여부를 제어하는 조건 해당 요소들이 바뀌면 쿼리 실행
		enabled: !!surveyType && !!surveyPage && !!surveyToken,
		// enabled: false, // true면 무조건 쿼리 실행, false면 refetch()시에만 실행
		refetchOnWindowFocus: false, // 웹 창에 다시포커스되면 다시 queryFn이 실행되는거 방지
	});
}
