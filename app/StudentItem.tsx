import React, { useCallback, useState } from "react";
import { StudentData } from "@/app/StudentDataList";

type StuProps = {
    stuData: StudentData;
    onChange: () => void;
};

const StudentItem = ({
    stuData: {
        id,
        attributes: { name, age, gender, school },
    },
    onChange,
}: StuProps) => {
    const url = `http://localhost:1337/api/students/${id}`;

    const [isLoading, setIsLoading] = useState(false);
    const [err, setErr] = useState("");

    const deleteItem = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch(url, { method: "delete" });

            if (!response.ok) {
                setErr("删除失败！");
                return;
            }

            onChange();
        } catch (e: any) {
            setErr(e.message);
        } finally {
            setErr("");
            setIsLoading(false);
        }
    }, [url]);

    if (err) {
        return <div> 数据加载异常。。。 </div>;
    }

    return (
        <>
            <tr
                className={"table-item"}
                key={id}
            >
                <td>{name}</td>
                <td>{age}</td>
                <td>{gender}</td>
                <td>{school}</td>
                <td>
                    <button
                        onClick={async () => {
                            await deleteItem();
                        }}
                        className={"btn-common"}
                    >
                        删除
                    </button>
                </td>
            </tr>
            {isLoading && (
                <tr>
                    <td colSpan={5}>正在删除数据。。。</td>
                </tr>
            )}
        </>
    );
};

export default StudentItem;
