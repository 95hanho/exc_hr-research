import { post_urlFormData } from "../../lib/apiFilter";
import API_URL from "../../api/endpoints";
import { useMutation } from "@tanstack/react-query";
import { Munhang, RequiredHideRule, ResultData } from "../../types/survey";

type AdminSetSurveyQuestionParam = {
	surveyType: string;
	surveyPage: string;
	top_menuList: string[];
	head_title: string;
	requiredList: RequiredHideRule[];
	munhangs: Munhang[];
	initData: ResultData;
};

// 설문 시작하기
export function useAdminSetSurveyQuestion() {
	return useMutation({
		mutationFn: async ({ surveyType, surveyPage, top_menuList, head_title, requiredList, munhangs, initData }: AdminSetSurveyQuestionParam) => {
			const param_obj = {
				surveyType,
				surveyPage,
				top_menu_list_jsonData: JSON.stringify({ top_menuList }),
				head_title,
				jsonData: JSON.stringify({
					requiredList,
					munhangs,
					initData,
				}),
			};
			const res = await post_urlFormData(API_URL.ADMIN_SURVEY, param_obj);
			return res.data;
		},
		/*
		// Mutation이 시작되기 직전에 특정 작업을 수행
		onMutate(a) {},
		onSuccess({ data }) {},
		onError(err) {},
		// 결과에 관계 없이 무언가 실행됨
		onSettled(data, err, params, context) {
			// console.log(data, err, params, context);
		},
        */
	});
}
