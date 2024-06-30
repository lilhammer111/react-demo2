import React, { ChangeEvent, useCallback, useState } from "react";
import { Student } from "@/app/StudentDataList";

const StudentForm = ({ onSubmit }: { onSubmit: () => void }) => {
    const [inputForm, setInputForm] = useState({
        name: "",
        age: 0,
        gender: "female",
        school: "",
    } as Student);

    const [isLoading, setIsLoading] = useState(false);

    const [error, setError] = useState(null as unknown);

    const changeNameHdl = (event: ChangeEvent<HTMLInputElement>) => {
        console.log("changing name: ", event);

        setInputForm((prevState) => {
            return {
                ...prevState,
                name: event.target.value,
            };
        });

        console.log(inputForm.name);
    };

    const changeAgeHdl = (event: ChangeEvent<HTMLInputElement>) => {
        const newAge = parseInt(event.target.value, 10);
        setInputForm((prevState) => {
            return {
                ...prevState,
                age: isNaN(newAge) ? 0 : newAge,
            };
        });
    };

    const changeGenderHdl = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (value === "male" || value === "female") {
            setInputForm((prevState) => {
                return {
                    ...prevState,
                    gender: value,
                };
            });
        }
    };

    const changeSchoolHdl = (event: ChangeEvent<HTMLInputElement>) => {
        setInputForm((prevState) => {
            return {
                ...prevState,
                school: event.target.value,
            };
        });
    };

    const addStudent = useCallback(async () => {
        const url = `http://localhost:1337/api/students`;
        setIsLoading(true);
        console.log("input form", inputForm);
        try {
            const response = await fetch(url, {
                method: "post",
                body: JSON.stringify({ data: inputForm }),
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                setError("添加失败");
                return;
            }

            onSubmit();
        } catch (e) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    }, [inputForm]);

    if (error) {
        return (
            <tr>
                <td colSpan={5}>添加数据错误。。。</td>
            </tr>
        );
    }

    return (
        <>
            {isLoading ? (
                <tr>
                    <td colSpan={5}>添加数据中。。。</td>
                </tr>
            ) : (
                <tr className={"table-item"}>
                    <td>
                        <input
                            onChange={changeNameHdl}
                            type="text"
                            value={inputForm.name}
                        />
                    </td>

                    <td>
                        <input
                            onChange={changeAgeHdl}
                            type="text"
                            value={inputForm.age}
                        />
                    </td>
                    <td>
                        <select
                            value={inputForm.gender}
                            onChange={changeGenderHdl}
                        >
                            <option value="male">男</option>
                            <option value="female">女</option>
                        </select>
                    </td>
                    <td>
                        <input
                            type="text"
                            onChange={changeSchoolHdl}
                            value={inputForm.school}
                        />
                    </td>
                    <td>
                        <button
                            onClick={async () => {
                                await addStudent();
                            }}
                            className={"btn-common"}
                        >
                            添加
                        </button>
                    </td>
                </tr>
            )}
        </>
    );
};

export default StudentForm;
