import { AnimatePresence, motion } from "framer-motion";
import styled from "@emotion/styled";
import { useContext } from "@state/Context";

const Root = styled(motion.button)``;

export const Ready = () => {
  const { context, isReady, dispatch } = useContext();

  return (
    <AnimatePresence>
      {!isReady && (
        <Root
          key="Root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900 bg-opacity-20 backdrop-blur-md cursor-pointer"
          onTap={async () => {
            await context.resume();
            dispatch({ type: "toggle-ready", value: true });
          }}
        >
          <div className="flex items-center justify-center fixed inset-48 bg-slate-900 bg-opacity-20 backdrop-blur-lg cursor-pointer">
            <span className="--mono">
              press any key or click to begin
            </span>
          </div>
        </Root>
      )}
    </AnimatePresence>
  );
};
