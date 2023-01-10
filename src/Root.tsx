import { useEffect, useState } from "react";
import App from "./App";
import DBProvider from "./Context/DBProvider";

const Root: React.FC = () => {
	return (
		<DBProvider>
			<App />
		</DBProvider>
	);
};
export default Root;
