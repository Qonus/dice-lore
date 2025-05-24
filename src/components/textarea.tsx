import { cn } from "@/lib/utils";
import TextareaAutosize, { TextareaAutosizeProps } from "react-textarea-autosize";

export default function Textarea({className, ...props}: TextareaAutosizeProps) { 
    return (
        <div className={cn("rounded-xl bg-card p-3 w-full", className)}>
            <TextareaAutosize
            className="w-full"
            maxRows={10}
            {...props}
            />
          </div>
    )
}