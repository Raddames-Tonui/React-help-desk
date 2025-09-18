import type { ApiResponse, SubjectData } from "@/utils/types";
import { createContext, useContext, type ReactNode } from "react";


type SubjectState = {
    data: ApiResponse<SubjectData> | null;
    subjects: SubjectData[];
    loading: boolean;
    error: boolean
}

const subjectContext = createContext<SubjectState | undefined>(undefined);


export function SubjectsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {



    const value:  = {

    }

    return <subjectContext.Provider value={value}>
        {children}
    </subjectContext.Provider>
}

export function useSubjects() {
    const context - useContext(subjectContext);
    if (!context) throw new Error("UseSubjects must be used within SubjectProvider")
    return context;
}