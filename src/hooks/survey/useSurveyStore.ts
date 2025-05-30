import { post_formData } from "../../lib/apiFilter";
import API_URL from "../../api/endpoints";
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "../useRedux";
import { PersonalInfo, SurveyStoreData } from "../../types/survey";

// 설문 저장 시 필요한 파라미터 타입
type SurveyStoreParams =
	| {
			surveyPage: 0;
			surveyType: string;
			resultInfoData: PersonalInfo;
			surveyToken?: string;
	  }
	| {
			surveyPage: number; // non-zero
			surveyType: string;
			resultInfoData: SurveyStoreData;
			surveyToken?: string;
	  };

// 설문 시작하기
export function useSurveyStore() {
	const dispatch = useAppDispatch();

	return useMutation({
		mutationFn: async ({ surveyType, surveyPage, resultInfoData, surveyToken }: SurveyStoreParams) => {
			const headers = surveyToken ? { token: surveyToken } : undefined;
			const res = await post_formData(API_URL.SURVEY_STORE, { surveyType, surveyPage, ...resultInfoData }, headers);
			return res.data;
		},
		onError() {
			dispatch({ type: "modal/on_modal_alert", payload: "서버오류발생<br>담당자에게 문의 해주세요." });
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
