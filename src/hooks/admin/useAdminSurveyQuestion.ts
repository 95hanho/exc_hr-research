import { useQuery } from "@tanstack/react-query";
import { get_normal } from "../../lib/apiFilter";
import API_URL from "../../api/endpoints";
import { RequiredHideRule, ResultData } from "../../types/survey";
import { Munhang } from "../../types/question";

interface AdminSurveyQuestionSuccess {
	code: 200;
	data: {
		jsonData: string;
		top_menu_list_jsonData: string;
		//
		initData: ResultData;
		munhangs: Munhang[];
		top_menuList: string[];
		requiredList: RequiredHideRule[];
		survey_answer_is_record: boolean;
	};
}

export type AdminSurveyQuestionFail = {
	code?: 4033 | 4034 | 4035;
	msg?: string;
};

export function useAdminSurveyQuestion(surveyType: string, surveyPage: string) {
	return useQuery({
		// 쿼리 키 - 바뀌는 경우 다른 요청으로 인식
		queryKey: ["adminSurveyQuestion", { surveyType, surveyPage }],
		queryFn: () => get_normal(API_URL.ADMIN_SURVEY, { surveyType, surveyPage }),
		select: ({ data }: { data: AdminSurveyQuestionSuccess | AdminSurveyQuestionFail }) => {
			const newData = { ...data };
			if (newData.code == 200) {
				if (typeof newData.data.jsonData === "string") {
					const obj = JSON.parse(newData.data.jsonData);
					newData.data.requiredList = obj.requiredList;
					newData.data.munhangs = obj.munhangs;
					newData.data.initData = obj.initData;
					// newData.data.survey_answer_is_record
				}
				if (typeof newData.data.top_menu_list_jsonData === "string") {
					newData.data.top_menuList = JSON.parse(newData.data.top_menu_list_jsonData).top_menuList;
				}
			}

			return newData;
		},
		// 해당 쿼리를 실행할지 여부를 제어하는 조건
		enabled: !!surveyType && !!surveyPage,
		refetchOnWindowFocus: false, // 웹 창에 다시포커스되면 다시 queryFn이 실행되는거 방지
	});
}
