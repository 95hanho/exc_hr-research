import { TypedUseSelectorHook, useDispatch, useSelector as rawUseSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = rawUseSelector;
