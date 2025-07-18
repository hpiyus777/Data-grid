import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";
import * as actions from "../redux/actions";

export const useGridData = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { groupedItems, loading, error } = useSelector(
    (state: RootState) => state.grid
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(actions.fetchGridDataRequest());
    }, 100);
    return () => clearTimeout(timeout);
  }, [dispatch]);

  return { groupedItems, loading, error, dispatch };
};
