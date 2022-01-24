import React, { Component } from "react";
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Modal, EventSubscriptionVendor, EventEmitter, LogBox } from "react-native"
import firestore from '@react-native-firebase/firestore';
import Tooltip from 'react-native-walkthrough-tooltip';

LogBox.ignoreAllLogs();

interface Ss {
  // Define States
  Excersize: any
  guess: any;
  touchableText: any;
  btndisable: any;
  touchablecolor: any
  touchableTextcolor: any;
  optionSelected: any;
  isModel: any;
  modelColor: any;
  ModelText: any;
  isAnswer: any;
  GermanQuestion: any;
  EnglishQuestion: any;
  toolTipVisible: any;
  toolTipVisible2: any;
}

const Screenwidth = Dimensions.get("window").width;
const Screenheight = Dimensions.get("window").height;

export default class App extends Component<{}, Ss> {

  constructor(props: any) {
    super(props);
    this.state = {
      // Define The Initial Values of States
      Excersize: 1,
      guess: '',
      touchableText: 'CONTINUE',
      btndisable: true,
      touchablecolor: 'rgb(91,146,164)',
      touchableTextcolor: '#fff',
      optionSelected: 0,
      isModel: false,
      modelColor: 'rgb(0,233,232)',
      ModelText: 'Answer : ',
      isAnswer: false,
      GermanQuestion: [],
      EnglishQuestion: [],
      toolTipVisible: false,
      toolTipVisible2: false,
    }
  }


  async componentDidMount() {

    //Get Data From Firebase / EnglishQuestion Table
    const responseEnglish = await firestore().collection('EnglishQuestion').get();

    responseEnglish.docs.forEach(item => {
      this.setState({ EnglishQuestion: [...this.state.EnglishQuestion, item.data()] })
    })

    //Get Data From Firebase / GermanQuestion Table

    const responseGerman = await firestore().collection('GermanQuestion').get();
    responseGerman.docs.forEach(item => {
      this.setState({ GermanQuestion: [...this.state.GermanQuestion, item.data()] })
    })

  }



  onOptionPress = (item: any, guessANS: any, selectedItem: any) => {
    // Set Guess answer , And changle color of touchables
    this.setState({ guess: guessANS, btndisable: false, touchablecolor: 'rgb(0,229,232)', touchableText: 'CHECK ANSWER', optionSelected: selectedItem })

  }
  onContinuePress = (ans: any) => {

    // on Submit Guess answer of Question

    this.setState({ isModel: true });
    console.log(this.state.guess, "ANS => ", ans);
    if (this.state.guess == ans) {
      this.setState({ isAnswer: true })
    }
    else {
      this.setState({ isAnswer: false })
    }
  }
  onModelContinuePress = () => {

    // Change Question and set all States to initial States.

    this.setState({ isModel: false, Excersize: this.state.Excersize + 1 })
    this.setState({

      guess: '',
      touchableText: 'CONTINUE',
      btndisable: true,
      touchablecolor: 'rgb(91,146,164)',
      touchableTextcolor: '#fff',
      optionSelected: 0,

      modelColor: 'rgb(0,233,232)',
      ModelText: 'Answer : ',

      isAnswer: false,
    })
  }
  EnglishRenderView = (item: any) => {

    // Rendering Question in English Language.

    return (

      //English View

      <View style={{ marginVertical: 20 }}>

        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={[styles.textColor, { fontSize: 25 }]}>{item.Prequestion}</Text>
          <Text style={[styles.textColor, { fontSize: 25, fontWeight: 'bold', textDecorationLine: 'underline' }]}>{item.guessWord}</Text>
          <Text style={[styles.textColor, { fontSize: 25 }]}>{item.Postquestion}</Text>
        </View>
      </View>
    )
  }
  GermanRenderView = (item: any) => {

    // Render View Which incluedes -> (Question in German Lang , Options , Submit Button)

    return (
      //German View

      <View style={{ marginVertical: 50 }}>


        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>

          {/* Setting ToolTip to Pre-Questions */}
          <Tooltip
            isVisible={this.state.toolTipVisible}
            content={<Text>{this.state.EnglishQuestion[item.id - 1].Prequestion}</Text>}
            placement="top"
            onClose={() => this.setState({ toolTipVisible: false })}
          >
            <Text onPress={() => this.setState({ toolTipVisible: true })} style={[styles.textColor, { fontSize: 25 }]}>{item.Prequestion}  </Text>

          </Tooltip>
          {
            this.state.guess != '' && this.state.isModel ?

              // After Submit Guess Answer Color Configuration
              <TouchableOpacity style={[styles.touchableOptions, { backgroundColor: this.state.isAnswer ? 'rgb(120,240,238)' : 'rgb(255,126,137)' }]}
                disabled={true}
              >

                <Text style={[styles.touchableText, { color: '#fff' }]}>{this.state.guess} </Text>
              </TouchableOpacity>
              :

              this.state.guess != '' ?

                // After Guessing Answere before submition
                <TouchableOpacity style={styles.touchableOptions}
                  disabled={true}
                >
                  <Text style={styles.touchableText}>{this.state.guess}</Text>
                </TouchableOpacity>
                :

                <Text style={[styles.textColor, { fontSize: 25, fontWeight: '500', }]}>{'________'}  </Text>
          }
          {/* Setting Tooltip to PostQuestion */}
          <Tooltip
            isVisible={this.state.toolTipVisible2}
            content={<Text>{this.state.EnglishQuestion[item.id - 1].Postquestion}</Text>}
            placement="top"
            onClose={() => this.setState({ toolTipVisible2: false })}

          >
            <Text onPress={() => this.setState({ toolTipVisible2: true })} style={[styles.textColor, { fontSize: 25 }]}>{item.Postquestion}</Text>
          </Tooltip>
        </View>

        {/* Options in German Lang */}

        <View style={{ marginTop: 25, width: Screenwidth * 0.60, alignSelf: 'center' }}>


          <View style={[styles.optionView, { marginLeft: 25, marginBottom: 20, marginTop: 40 }]}>
            {/* Option 1 */}
            <TouchableOpacity style={this.state.optionSelected == 1 ? styles.selectedTouchable : this.state.isModel ? [styles.touchableOptions, { backgroundColor: 'rgb(153,181,191)' }] : styles.touchableOptions}
              onPress={() => this.onOptionPress(item, item.option1, 1)}
            >
              <Text style={this.state.optionSelected == 1 ? styles.selectedTouchableText : styles.touchableText}>{item.option1}</Text>
            </TouchableOpacity>
            {/* Option 2 */}
            <TouchableOpacity style={this.state.optionSelected == 2 ? styles.selectedTouchable : this.state.isModel ? [styles.touchableOptions, { backgroundColor: 'rgb(153,181,191)' }] : styles.touchableOptions}
              onPress={() => this.onOptionPress(item, item.option2, 2)}
            >
              <Text style={this.state.optionSelected == 2 ? styles.selectedTouchableText : styles.touchableText}>{item.option2}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.optionView, { marginLeft: 5 }]}>
            {/* Option 3 */}
            <TouchableOpacity style={this.state.optionSelected == 3 ? styles.selectedTouchable : this.state.isModel ? [styles.touchableOptions, { backgroundColor: 'rgb(153,181,191)' }] : styles.touchableOptions}
              onPress={() => this.onOptionPress(item, item.option3, 3)}
            >
              <Text style={this.state.optionSelected == 3 ? styles.selectedTouchableText : styles.touchableText}>{item.option3}</Text>
            </TouchableOpacity>
            {/* Option 4 */}
            <TouchableOpacity style={this.state.optionSelected == 4 ? styles.selectedTouchable : this.state.isModel ? [styles.touchableOptions, { backgroundColor: 'rgb(153,181,191)' }] : styles.touchableOptions}
              onPress={() => this.onOptionPress(item, item.option4, 4)}
            >
              <Text style={this.state.optionSelected == 4 ? styles.selectedTouchableText : styles.touchableText}>{item.option4}</Text>
            </TouchableOpacity>
          </View>

          {/* Button of Model */}
          <View style={{ marginTop: Screenheight * 0.200, alignItems: 'center' }}>
            <TouchableOpacity
              style={[styles.continueButton, { backgroundColor: this.state.touchablecolor }]}
              disabled={this.state.btndisable}
              onPress={() =>
                this.state.touchableText == 'CHECK ANSWER' ?
                  this.onContinuePress(item.answere)
                  :
                  null
              }
            >
              <Text style={{ color: this.state.touchableTextcolor, fontWeight: '700', fontSize: 15 }}>{this.state.touchableText}</Text>
            </TouchableOpacity>
          </View>
        </View>
        {
          this.state.isModel ?

            // Model After the Submission of Guess Answer

            <Modal
              transparent={true}
              animationType="slide"
            >
              <View style={{ backgroundColor: this.state.isAnswer ? 'rgb(120,240,238)' : 'rgb(255,126,137)', marginTop: Screenheight * 0.70, flex: 1, borderRadius: 25 }}>
                <View style={{ marginTop: Screenheight * 0.04, marginLeft: 25 }}>

                  {/* Answer View Of Right/Wrong Answer */}

                  {
                    this.state.isAnswer ?
                      <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>Great Job !</Text>
                      :
                      <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>Answer : {item.answere}</Text>

                  }
                </View>

                {/* Continue Button After Submission and Getting Answer of Question */}

                <TouchableOpacity
                  onPress={() => this.onModelContinuePress()}
                  style={[styles.touchableOptions, { margin: 30, borderRadius: 40, paddingTop: 25, paddingBottom: 25, }]}
                >
                  <Text style={{ color: this.state.isAnswer ? 'rgb(120,240,238)' : 'rgb(255,126,137)', fontWeight: 'bold' }}>CONTINUE</Text>
                </TouchableOpacity>
              </View>

            </Modal>
            :
            null
        }
      </View>

    )

  }

  render(): React.ReactNode {


    return (

      <SafeAreaView style={styles.container}>

        <View style={styles.mainView}>

          {/* Header Text */}
          <View style={styles.titleTextView}>
            <Text style={[styles.textColor]}>Fill in the missing word</Text>
          </View>

          {/* Mapping The Question From State From Firebase Array */}
          {
            this.state.EnglishQuestion.map((item: any) => (

              //Comparing ID to Retrive Question Accordingly

              item.id == this.state.Excersize ?

                //Calling Function Which Show Question from Array

                this.EnglishRenderView(item)
                :
                null
            ))
          }

          {/* Mapping The Option of  Question From State From Firebase Array */}
          {
            this.state.GermanQuestion.map((item: any) => (

              //Comparing ID to Retrive Options of Question Accordingly

              item.id == this.state.Excersize ?
                (
                  //Calling Function Which Show Options and Model Designs

                  this.GermanRenderView(item)
                )
                :
                null
            ))
          }
        </View>
      </SafeAreaView>
    )
  }
}
//Styling of Code
const styles = StyleSheet.create({

  //Question and Option Text Color

  textColor: {
    color: '#fff',
  },
  //SafeAreView

  container: {
    flex: 1,
    backgroundColor: 'rgb(50,108,128)'
  },
  mainView: {
    flex: 1
  },
  // Header Text
  titleTextView: {
    marginTop: 10,
    alignItems: 'center'
  },
  //Options 
  optionView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  // Touchable of Options,Guessed Answer , Submit Button 
  touchableOptions: {
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
  },
  // Text of Options,Guessed Answer , Submit Button 
  touchableText: {
    color: 'rgb(50,108,128)',
    fontWeight: 'bold',

  },
  //Guessed Answer By User
  selectedTouchable: {
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
    backgroundColor: 'rgb(91,146,164)',
    borderRadius: 20,
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
  },
  // Guessed Touchable Text By User.
  selectedTouchableText: {
    color: 'rgb(91,146,164)',
  },
  //
  // Model Button Which Changed the Question.
  continueButton: {
    padding: 15,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: Screenwidth * 0.80,
  },


})