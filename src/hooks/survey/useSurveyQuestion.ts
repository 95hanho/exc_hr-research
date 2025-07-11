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
		head_img_url: string;
		headerTitle: string;
		initData: Record<string, string>;
		munhangs: Munhang[];
		progress_raw: boolean[];
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
			if (isTest) console.log(res);
			const newData: surveyQuestionSuccess | surveyQuestionFail = { ...res.data };
			if (newData.code === 200) {
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
				newData.data.munhangs.forEach((munhang) => {
					munhang.questions.map((question) => {
						rNum++;
						question.R_num = rNum;
					});
				});
			}

			return newData;
		},
		// 해당 쿼리를 실행할지 여부를 제어하는 조건 해당 요소들이 바뀌면 쿼리 실행
		enabled: !!surveyType && !!surveyPage && !!surveyToken,
		// enabled: false, // true면 무조건 쿼리 실행, false면 refetch()시에만 실행
		refetchOnWindowFocus: false, // 웹 창에 다시포커스되면 다시 queryFn이 실행되는거 방지
	});
}
