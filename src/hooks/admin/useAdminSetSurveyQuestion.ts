// hooks/survey/useSurveyCommonInfo.ts
import { post_urlFormData } from "../../lib/apiFilter";
import API_URL from "../../api/endpoints";
import { useMutation } from "@tanstack/react-query";

type AdminSurveyQuestion = {
	surveyType: string;
	surveyPage: string;
	top_menu_list_jsonData: string;
	head_title: string;
	jsonData: string;
};

// 설문 시작하기
export function useAdminSetSurveyQuestion() {
	return useMutation({
		mutationFn: async ({ surveyType, surveyPage, top_menu_list_jsonData, head_title, jsonData }: AdminSurveyQuestion) => {
			const res = await post_urlFormData(API_URL.ADMIN_SURVEY, { surveyType, surveyPage, top_menu_list_jsonData, head_title, jsonData });
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
