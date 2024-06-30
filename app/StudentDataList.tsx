import React, { useCallback, useEffect, useState } from "react";
import StudentItem from "@/app/StudentItem";
import StudentForm from "@/app/StudentForm";

export type StudentData = {
    id: number;
    attributes: Student;
};

export type Student = {
    name: string;
    age: number;
    gender: "male" | "female";
    school: string;
};

const StudentDataList = () => {
    const [studentDataList, setStudentDataList] = useState<StudentData[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const [err, setErr] = useState("");

    const fetchData = useCallback(async () => {
        try {
            setErr("");
            const url = "http://localhost:1337/api/students";

            const response = await fetch(url);
            if (response.ok) {
                response.json().then((data) => {
                    setStudentDataList(data.data);
                });
            } else {
                setErr("数据加载失败");
            }
        } catch (err: any) {
            console.log(`err message: ${err.message}`);
            setErr(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    const reload = () => {
        setIsLoading(true);
        fetchData();
    };

    if (err) {
        return <div> 数据加载异常。。。 </div>;
    }

    return (
        <div className={"flex flex-col items-center gap-4"}>
            {isLoading ? (
                <div> 数据正在加载中。。。</div>
            ) : (
                <table>
                    <thead>
                        <tr className={"table-item"}>
                            <th>name</th>
                            <th>age</th>
                            <th>gender</th>
                            <th>school</th>
                            <th>operate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentDataList.map((item) => {
                            return (
                                <StudentItem
                                    onChange={fetchData}
                                    stuData={item}
                                    key={item.id}
                                ></StudentItem>
                            );
                        })}
                    </tbody>

                    <tfoot><StudentForm onSubmit={fetchData}></StudentForm></tfoot>
                </table>
            )}

            <button
                className={"btn-common"}
                onClick={reload}
            >
                重新加载数据
            </button>
        </div>
    );
};

export default StudentDataList;
