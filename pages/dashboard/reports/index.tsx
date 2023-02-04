import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../../components/layout";
import { getReportsAsync } from "../../../lib/reports";
import { Report } from "../../../types/reports";

const Reports: NextPage = ({ reports }: any) => {

    reports = JSON.parse(reports);

    const router = useRouter()
    const query = router.query;

    console.log(reports)
    function refreshReports() {
        router.replace(router.asPath);
    }

    function Type(props: { type: string }) {
        if (props.type === "fod") {
            return (
                <span>Foreign Object Debris</span>
            )
        } else if (props.type === "wildlife") {
            return (
                <span>Wildlife</span>
            )
        } else {
            return (<></>)
        }
    }

    function TypeAndSeverity(props: { severity: number, type: string }) {
        if (props.severity === 1) {
            return (
                <div className="d-flex flex-column">
                    <Type type={props.type} />
                    <strong>(Danger to Operations)</strong>
                </div>
            )
        } else if (props.severity === 2) {
            return (
                <div className="d-flex flex-column">
                    <Type type={props.type} />
                    <strong>(Danger to Life)</strong>
                </div>
            )
        } else {
            return (
                <div className="d-flex flex-column">
                    <Type type={props.type} />
                </div>
            )
        }
    }

    return (
        <Layout>
            <div className="container text-center">
                <h1>Reports</h1>
                {/* <span>Query: {query.filter ? query.filter : "None"}</span> */}
                {reports.length < 1 ?
                    <>
                        <div className="mt-3">
                            <span style={{ display: "block" }}>No reports have been made.</span>
                        </div>
                    </>
                    :

                    <table className="table table-hover mt-3">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Type</th>
                                <th scope="col">Description</th>
                                <th scope="col">Author</th>
                                <th scope="col">Location</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report: Report, index: number) => {
                                const tableColour = report.severity === 1 ? "table-warning" : report.severity === 2 ? "table-danger" : ""
                                return (
                                    <tr key={index} className={tableColour}>
                                        <th scope="row">{report._id}</th>
                                        <td>
                                            <TypeAndSeverity severity={report.severity} type={report.type} />
                                        </td>
                                        <td>{report.description}</td>
                                        <td>{report.author}</td>
                                        <td>{report.lat}, {report.lng}</td>
                                        <td>Open</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                }
                <button className="btn btn-primary mt-2" onClick={() => refreshReports()}>Refresh</button>
            </div>
        </Layout>
    );
};

export async function getServerSideProps() {
    // get reports
    const rawReports = await getReportsAsync();
    // parse the result of the db call into a string.
    const reports = JSON.stringify(rawReports);
    return { props: { reports } }
}

export default Reports;
