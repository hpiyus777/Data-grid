import { memo } from "react";
import { twMerge } from "tailwind-merge";

interface INoRecordsProps {
  image: string;
  text?: string;
  rootClassName?: string;
  textClassName?: string;
  imageWSize?: string;
  imageHSize?: string;
}

const NoRecords = ({
  image,
  text = "No Records Available",
  rootClassName = "",
  textClassName = "",
  imageWSize = "92",
  imageHSize = "92",
}: INoRecordsProps) => {
  return (
    <div
      className={twMerge(
        `flex flex-col gap-[15px] py-3 justify-center items-center ${rootClassName}`
      )}
    >
      <img
        src={image}
        alt="No Records Available"
        width={imageWSize}
        height={imageHSize}
        className="mx-auto"
      />
      <p
        className={twMerge(`text-xs text-black font-semibold ${textClassName}`)}
      >
        {text}
      </p>
    </div>
  );
};

export default memo(NoRecords);
