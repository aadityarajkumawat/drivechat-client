import { RotateCw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface ReIndexProps {
  drive_url: string;
  name: string;
  startIndexing: () => void;
  indexing: boolean;
}

export function ReIndex(props: ReIndexProps) {
  return (
    <div className="text-sm underline w-full max-w-[700px] text-center">
      <div className="flex items-center justify-center gap-3">
        <a href={props.drive_url}>{props.name}</a>
        <AlertDialog>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button
                  variant={"outline"}
                  size="icon"
                  className="p-1 w-8 h-8"
                  onClick={props.startIndexing}
                >
                  <RotateCw size={18} />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Re-Index your drive documents</p>
            </TooltipContent>
          </Tooltip>
          <AlertDialogContent
            security="on"
            className="sm:max-w-[425px] flex justify-center items-center flex-col"
          >
            {props.indexing ? (
              <>
                <p>Refreshing Index</p>
                <p className="text-center">
                  It might take a while to index your documents based on their
                  size.
                </p>
                <img src="/bars-rotate-fade.svg" alt="spinner" />
              </>
            ) : (
              <>
                <p>Indexing Complete</p>
                <AlertDialogCancel>Updated! Continue</AlertDialogCancel>
              </>
            )}
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
