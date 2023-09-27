import { FC, PropsWithChildren } from "react";
import { TH__SeparatorBlock, TH__SeparatorBlockAddContainer, TH__SeparatorBlockTitle } from "./styled";
import { AddSymbolSVG } from "@/components/common/Svg";


type ListSeparatorProps = {
    hideAdd?: boolean;
    onClickAdd?: () => void;
}

const ListSeparator: FC<PropsWithChildren<ListSeparatorProps>> = (props) => {
    const hideAdd = props.hideAdd ?? false;
    return (
        <TH__SeparatorBlock>
            <TH__SeparatorBlockTitle>
                {props.children}
            </TH__SeparatorBlockTitle>
            {
                !hideAdd ? (
                    <TH__SeparatorBlockAddContainer onClick={props.onClickAdd}>
                        <AddSymbolSVG />
                    </TH__SeparatorBlockAddContainer>

                ) : (<></>)
            }
        </TH__SeparatorBlock>
    )
};

export default ListSeparator;