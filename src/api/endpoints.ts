// API 엔드포인트 목록 - API url 모음집, pathstring은 ':변수명' 이렇게 쓰기
const survey = "/api/expert/survey";
const admin = "/api/expert/admin";

const API_URL = {
	/* 관리자 */
	ADMIN_COMMON: admin + "/company", // 설문 목록 조회, 설문생성
	ADMIN_COMMON_SET: admin + "/company/common", // 설문 공통 정보 저장
	ADMIN_SURVEY_BANNER: admin + "/company/detail/:surveyType", // 설문 베너 조회, 저장
	ADMIN_SURVEY: admin + "/question/:surveyType/:surveyPage", // 설문 정보 조회, 저장
	ADMIN_STORE_TABLE: admin + "/set-insert/:surveyType/:surveyPage", // 설문 결과테이블 만들기
	ADMIN_SURVEY_RESULT: admin + "/answer/data/:surveyType/:surveyPage", // 설문 답 조회
	ADMIN_SURVEY_DELETE: admin + "/member/remove/:surveyType", // 설문내용 삭제
	ADMIN_SURVEY_RESULT_SUBMIT_CANCEL: admin + "/member/status/:surveyType", // 설문 제출 취소
	ADMIN_SUJU: admin + "/suju/answer/data/:surveyType", // 수주용 설문 결과 조회
	ADMIN_SUJU_MEMBER: admin + "/member/suju", // 수주용 담당자 변경
	/* 설문 */
	SURVEY_COMMON: survey + "/company/common/material", // 공통 정보 조회
	SURVEY_INTRO: survey + "/company/:surveyType", // 설문 인트로페이지 조회
	SURVEY_ENTER: survey + "/default/process/:surveyType", // 이메일 입력 후 설문정보 들어가기
	SURVEY_QUESTION: survey + "/question/:surveyType/:surveyPage", // 설문문항 정보 조회
	SURVEY_QUESTION_VIEW: survey + "/question-tester/:surveyType/:surveyPage", // 설문문항 테스트 정보 조회
	SURVEY_STORE: survey + "/answer/:surveyType/:surveyPage", // 설문문항 답변 저장
};

export default API_URL;
