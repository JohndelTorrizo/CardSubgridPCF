import { IInputs, IOutputs } from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class CardSubgrid implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private mainContainer: HTMLDivElement;
    private context: ComponentFramework.Context<IInputs>;

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this.context = context;

        this.mainContainer = document.createElement("div");
        this.mainContainer.classList.add("card-container");

        container.appendChild(this.mainContainer);
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this.context = context;
        const dataSet = context.parameters.sampleDataSet;

        // Clear previous renders
        this.mainContainer.innerHTML = "";

        if (dataSet.loading) {
            const loadingMsg = document.createElement("div");
            loadingMsg.innerText = "Loading...";
            this.mainContainer.appendChild(loadingMsg);
            return;
        }

        if (!dataSet.sortedRecordIds || dataSet.sortedRecordIds.length === 0) {
            const emptyMsg = document.createElement("div");
            emptyMsg.className = "no-records";
            emptyMsg.innerText = "No records found.";
            this.mainContainer.appendChild(emptyMsg);
            return;
        }
 
        // Records Renderer
        for (const currentRecordId of dataSet.sortedRecordIds) {
            const record = dataSet.records[currentRecordId];

            const cardElement = document.createElement("div");
            cardElement.classList.add("dataset-card");


            cardElement.addEventListener("click", () => {
                dataSet.openDatasetItem(record.getNamedReference());
            });

            for (const column of dataSet.columns) {
                if (column.isHidden) continue;

                const dataRow = document.createElement("div");
                dataRow.classList.add("card-data-row");

                const labelElement = document.createElement("div");
                labelElement.classList.add("card-label");
                labelElement.innerText = column.displayName;

                const valueElement = document.createElement("div");
                valueElement.classList.add("card-value");

                const rawValue = record.getFormattedValue(column.name);
                valueElement.innerText = rawValue ? rawValue : "-";

                dataRow.appendChild(labelElement);
                dataRow.appendChild(valueElement);

                cardElement.appendChild(dataRow);
            }
            this.mainContainer.appendChild(cardElement);
        }

        // Handle Pagination
        if (dataSet.paging.hasNextPage) {
            const loadMoreBtn = document.createElement("button");
            loadMoreBtn.innerText = "Load More";
            loadMoreBtn.classList.add("load-more-btn");
            loadMoreBtn.onclick = () => {
                dataSet.paging.loadNextPage();
            };
            this.mainContainer.appendChild(loadMoreBtn);
        }
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        this.mainContainer.innerHTML = "";
    }
}