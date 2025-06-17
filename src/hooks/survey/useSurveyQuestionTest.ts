import { useQuery } from "@tanstack/react-query";
import { get_normal } from "../../api/apiFilter";
import API_URL from "../../api/endpoints";
import { Munhang } from "../../types/question";

export type surveyQuestionTestSuccess = {
	code: 200;
	data: {
		head_img_url: string;
		headerTitle: string;
		initData: Record<string, string>;
		munhangs: Munhang[];
		progress_raw: null;
		requiredList: null;
		store_data: null;
		top_menuList: string[];
	};
};
export type surveyQuestionTestFail = {
	code: 406;
	msg: string;
};

// 설문 정보 및 문항 조회
export function useSurveyQuestionTest(surveyType: string, surveyPage: string) {
	return useQuery({
		// 쿼리 키 - 바뀌는 경우 다른 요청으로 인식
		queryKey: ["surveyQuestion", { surveyType, surveyPage }],
		queryFn: () => {
			console.log("queryFn");
			return get_normal(API_URL.SURVEY_QUESTION_VIEW, { surveyType, surveyPage });
		},
		select: (res): surveyQuestionTestSuccess | surveyQuestionTestFail => {
			return res.data;
		},
		// 해당 쿼리를 실행할지 여부를 제어하는 조건 해당 요소들이 바뀌면 쿼리 실행
		// enabled: !!surveyType && !!surveyPage && !!surveyToken,
		enabled: false, // true면 무조건 쿼리 실행, false면 refetch()시에만 실행
	});
}
