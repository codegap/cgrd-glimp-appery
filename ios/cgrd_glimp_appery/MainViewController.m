//
//  MainViewController.m
//
#import "MainViewController.h"
#import "TiggziURLProtocol.h"

#import <AVFoundation/AVFoundation.h>

static const CGFloat kStatusBarHeight = 20;

@interface MainViewController ()

@property (nonatomic, assign) BOOL initializeCompleted;
@property (nonatomic, retain) NSURLRequest *delayedRequest;
@property (nonatomic, retain) id rotationObserver;

/**
 * Register TiggziURLProtocol to configure server trust authentication chalenge
 *     for allow or reject self-signed certificates.
 * This method should be invoked after [CDVViewController viewDidLoad] method
 *     to place TiggziURLProtocol behind CDVURLProtocol.
 */
- (void)registerCustomURLProtocol;
- (void)unregisterCustomURLProtocol;

@end

@implementation MainViewController

@synthesize initializeCompleted, delayedRequest;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self)
    {
        self.initializeCompleted = NO;
        self.delayedRequest = nil;
    }
    return self;
}

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
    [_rotationObserver release];
    _rotationObserver = nil;
    
    [self unregisterCustomURLProtocol];
    self.delayedRequest = nil;
    [super dealloc];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    [self registerCustomURLProtocol];
    [self allowBackgroundAudioPlay];

    self.initializeCompleted = YES;
    self.webView.dataDetectorTypes = UIDataDetectorTypeNone;
    if(nil != self.delayedRequest)
    {
        [self.webView loadRequest:self.delayedRequest];
        self.delayedRequest = nil;
    }
}

- (void) viewDidAppear:(BOOL)animated
{
    [super viewDidAppear:animated];
    [[NSNotificationCenter defaultCenter] removeObserver:self.rotationObserver];
    self.rotationObserver = nil;
}

- (void) viewDidDisappear:(BOOL)animated
{
    [super viewDidDisappear:animated];
    //ETST-14838
    if (SYSTEM_VERSION_LESS_THAN(@"7.0"))
    {
        self.rotationObserver = [[NSNotificationCenter defaultCenter] addObserverForName:UIDeviceOrientationDidChangeNotification
                                                                                  object:nil
                                                                                   queue:[NSOperationQueue mainQueue]
                                                                              usingBlock:^(NSNotification *note) {
                                                                                  CGSize screen = [[UIScreen mainScreen] bounds].size;
                                                                                  CGFloat statusBarHeight = [UIApplication sharedApplication].statusBarHidden ? 0 : kStatusBarHeight;
                                                                                  NSLog(@"%f", statusBarHeight);
                                                                                  UIInterfaceOrientation orientation = [[UIApplication sharedApplication] statusBarOrientation];
                                                                                  if (UIDeviceOrientationIsPortrait(orientation))
                                                                                  {
                                                                                      self.view.frame = CGRectMake(0, 0, screen.width, screen.height - statusBarHeight);
                                                                                  }
                                                                                  else
                                                                                  {
                                                                                      self.view.frame = CGRectMake(0, 0, screen.height, screen.width - statusBarHeight);
                                                                                  }
                                                                              }];
    }
}

#pragma mark - UIWebViewDelegate

- (BOOL)webView:(UIWebView*)theWebView shouldStartLoadWithRequest:(NSURLRequest*)request navigationType:(UIWebViewNavigationType)navigationType
{
    if(self.initializeCompleted)
    {
        return [super webView:theWebView shouldStartLoadWithRequest:request navigationType:navigationType];
    }
    
    self.delayedRequest = request;
    return NO;
}

#pragma mark - Utility methods
- (void)registerCustomURLProtocol
{
    BOOL allowAllCertificates = [(NSNumber *)[self.settings objectForKey:@"AllowAllHTTPSCertificates"] boolValue];
    [TiggziURLProtocol registerWithWhiteList:self.whitelist allowAllCertificates:allowAllCertificates];
}

- (void)unregisterCustomURLProtocol
{
    [TiggziURLProtocol unregisterClass:[TiggziURLProtocol class]];
}

- (void)allowBackgroundAudioPlay
{
    
    NSError *setBackgroundAudioPlayError = nil;
    
    [[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback error:&setBackgroundAudioPlayError];
    if (setBackgroundAudioPlayError != nil) {
        NSLog(@"Cannot activate audio background playing due to error: %@.", setBackgroundAudioPlayError);
        return;
    }
}

- (UIWebView *)newCordovaViewWithFrame:(CGRect)bounds
{
    return [super newCordovaViewWithFrame:bounds];
}

@end
