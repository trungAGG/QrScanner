import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonRow, IonText, IonTitle, IonToolbar, useIonAlert } from '@ionic/react';
import { useEffect, useState } from 'react';
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';
import ExploreContainer from '../components/ExploreContainer';
import { scanOutline, stopCircleOutline } from 'ionicons/icons'
import './Home.css';

const Home: React.FC = () => {
  const [err, setErr] = useState<string>()
  const [hideBg, setHideBg] = useState("")

  const startScan = async () => {
    BarcodeScanner.startScan({ targetedFormats: [SupportedFormat.QR_CODE] }); // this will now only target QR-codes
    BarcodeScanner.hideBackground(); // make background of WebView transparent
    setHideBg('hideBg')
    const result = await BarcodeScanner.startScan(); // start scanning and wait for a result
    stopScan()
    // if the result has content
    if (result.hasContent) {
      console.log(result.content); // log the raw scanned content
      present(result.content!, [{ text: 'OK', role: 'cancel' }])
    }
  };

  const stopScan = () => {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    setHideBg("")
  };

  const [present] = useIonAlert()

  useEffect(() => {
    const checkPermission = async () => {
      // check or request permission
      try {
        const status = await BarcodeScanner.checkPermission({ force: true });

        if (status.granted) {
          // the user granted permission
          return true;
        }

        return false;
      } catch (error) {

      }

    }
    checkPermission()
    return () => {

    }
  }, [])

  if (err) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>QR-SCanner</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className='ion-padding'>
          <IonRow>
            <IonText color='danger'>{err}</IonText>
          </IonRow>
        </IonContent>
      </IonPage>
    );
  } return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>QR-SCanner</IonTitle>
          <IonButton slot='end' hidden={!hideBg} onClick={stopScan} color='danger'>
            <IonIcon icon={stopCircleOutline} />Stop Scan</IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className={hideBg}>
        <IonButton className='start-scan-button' hidden={!!hideBg} onClick={startScan}>
          <IonIcon icon={scanOutline} slot='start' />Start Scan</IonButton>
        <div hidden={!hideBg} className='scan-box'></div>
      </IonContent>
    </IonPage>
  )
};

export default Home;
