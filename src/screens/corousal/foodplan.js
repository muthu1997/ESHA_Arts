import React from "react";
import { View, StyleSheet, Image, Dimensions, ScrollView } from "react-native";
import * as COLOUR from "../../../constants/colors";
import Header from "../../../component/header";
import Text from "../../../component/text";
const { width, height } = Dimensions.get("screen");
export default function Corousal(props) {
    const breakfast = [
        "https://img.freepik.com/free-photo/oats_1368-5509.jpg?t=st=1657869073~exp=1657869673~hmac=ecca121a3d5599e62b56cd4ad8157ff1dd554003987c4465864675e6d6903ba4&w=1800",
        "https://img.freepik.com/free-photo/three-fresh-organic-raw-eggs-isolated-white-surface_114579-43677.jpg?t=st=1657869179~exp=1657869779~hmac=6c44d6af0b6c4a3439b50d3ff90d70281601551da00c60b281ca5b6743c7ccff&w=1800",
        "https://img.freepik.com/free-vector/sport-nutrition-containers-sumbbells_1284-6583.jpg?t=st=1657869225~exp=1657869825~hmac=3073a9aa93bdee1906476979582922e85acdc59c61ad9afb33ff3642e68dccd4&w=1380",
        "https://img.freepik.com/free-photo/macro-pills_144627-15321.jpg?t=st=1657869293~exp=1657869893~hmac=157de89446aa36fbba27b82eae28e92915c85a2c93288e673288b86085f08e03&w=1800",
        "https://img.freepik.com/free-vector/pills-tablets-medicine-drugs-capsules-set_107791-12401.jpg?t=st=1657869351~exp=1657869951~hmac=5372d8e1f3eb30f6a1f066d4c2b83748730a65c5aa174d04d6f66b4e8b4d0337&w=1800"
    ]
    const midday = [
        "https://img.freepik.com/free-photo/two-red-apples-isolated-white_114579-73124.jpg?t=st=1657869273~exp=1657869873~hmac=be13ccedf07bf7704150ed978f2959d3850906c07c74e2d6bfc622f35c0a9060&w=1800",
        "https://img.freepik.com/free-vector/set-realistic-green-tea-leaves-sprouts-isolated-white-background-sprig-green-tea-tea-leaf-vector-illustration_87521-3451.jpg?t=st=1657869929~exp=1657870529~hmac=7d87a5307a3189935404891b712072396fecca30d88a613f1a3c0d6a540cc8e3&w=1800",

    ]
    const lunch = [
        "https://img.freepik.com/premium-photo/rice-plants-grains-thai-jasmine-rice-wood-bowl-white-surface_436608-1400.jpg?w=1800",
        "https://img.freepik.com/free-photo/large-set-isolated-vegetables-white-background_485709-44.jpg?t=st=1657870141~exp=1657870741~hmac=829e77bfc5e332f697ee115a35757a39298c3f66d872366e6e6da045a19775ca&w=1380"
    ]
    const aftmid = [
        "https://img.freepik.com/free-photo/fresh-tasty-oat-biscuits_144627-24430.jpg?t=st=1657870241~exp=1657870841~hmac=416570c204dab25a5012b4c1447cb22484b7450519abb6b3689de0f88b0195dc&w=900",
        "https://img.freepik.com/free-vector/tea-brewing-bag-realistic-icon-set-different-types-tea-brewing-strainer-tea-bag-par-example-vector-illustrationk_1284-30835.jpg?t=st=1657869979~exp=1657870579~hmac=ce822d0fc8e63ca7f8d80fc02b1b8432f7bef372d8ee672bf5c752f7cefb7445&w=1380"
    ]
    const dinner = [
        "https://img.freepik.com/premium-photo/chapati-tanturi-roti_57665-11320.jpg?w=1800",
        "https://img.freepik.com/free-photo/fresh-vegetable-salad_1339-5091.jpg?t=st=1657870398~exp=1657870998~hmac=9d6e282c69b2f2eac2fbde237836de646616a00bd1d86625f52420c14032f839&w=1800"
    ]
    const bed = [
        "https://img.freepik.com/premium-photo/scoop-protein-powder-isolated-white_492434-173.jpg?w=1800",
        "https://img.freepik.com/free-photo/delicious-peanut-butter-table_144627-12429.jpg?t=st=1657870489~exp=1657871089~hmac=4a6122f62bcf3a71516f539daa6eef8d0b32bf04debdfd44dbf330fe3655ad35&w=1800"
    ]
    const renderPlanCard = (title, subtitle, image) => {
        return (
            <View style={styles.planCard}>
                <View style={styles.title}>
                    <Text type="title" title={title} style={{ color: COLOUR.WHITE }} />
                </View>
                {subtitle.map((item, index) => {
                    return <View style={{ alignItems: "center", flexDirection: "row", width: "100%", marginVertical: 5, overflow: "hidden" }}>
                        <View style={{ width: width / 4, height: width / 4, marginRight: 5 }}>
                            <Image source={{ uri: image?.length > 0 ? image[index] : "https://www.eatthis.com/wp-content/uploads/sites/4/2020/01/man-healthy-food-diet-eggs-proteins-salmon.jpg?quality=82&strip=1" }} style={styles.image} resizeMode="contain" />
                        </View>
                        <Text key={index} type="label" title={item} style={{ color: COLOUR.BLACK, width: "75%" }} />
                    </View>
                })}
            </View>
        )
    }
    return (
        <View style={styles.container}>
        <Header
            back
            navigation={props.navigation}
            title={"Diet Plan"}
        />
            <ScrollView style={{ flex: 1, paddingBottom: 10 }}>
                {renderPlanCard("Breakfast", ["Oats 1 cup", "4 egg white", "Whey protein milk sheik", "Fish oil", "Multi vitamin tablet"], breakfast)}
                {renderPlanCard("Mid day", ["1 medium apple", "Green tea or black coffee"],midday)}
                {renderPlanCard("Lunch", ["1 Bowl rice", "Vegetables"], lunch)}
                {renderPlanCard("Afternoon Mid", ["4 Oats biscuits", "Green tea or coffee"], aftmid)}
                {renderPlanCard("Dinner", ["4 chappathi or 5 idli", "Vegetable salad"],dinner)}
                {renderPlanCard("Before bed", ["Whey protein", "One table spoon peanut butter"], bed)}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.WHITE
    },
    planCard: {
        width: "90%",
        alignSelf: "center",
        alignItems: "center",
        padding: 15,
        backgroundColor: COLOUR.WHITE,
        borderRadius: 10,
        marginVertical: 5
    },
    image: {
        width: "100%",
        height: "100%"
    },
    title: {
        width: "100%",
        alignSelf: "center",
        padding: 10,
        borderRadius: 10,
        backgroundColor: COLOUR.SECONDARY_LIGHT,
        alignItems: "center",
        justifyContent: "center"
    }
})